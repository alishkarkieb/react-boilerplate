import { Avatar, Badge, Box, Button, CircularProgress, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useMemo, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { GetUsersDocument, type GetUsersQuery } from '../../modules/user/graphql/user.generated';
import { GetChatsDocument, type GetChatsQuery, AddChatDocument, type AddChatMutationVariables } from './graphql/chat.generated';
import { useAuth } from '../../utils/authContext';
import { graphqlRequest } from '../../utils/axios';
import { useSocket } from '../../utils/socketContext';

export const ChatLayout = () => {
    const { token } = useAuth(); 
    
    // Get current user ID from token
    const currentUserId = useMemo(() => {
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            return decoded.userId || decoded.sub;
        } catch (e) {
            return null;
        }
    }, [token]);

    const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
    const [messageInput, setMessageInput] = useState("");
    
    const { onlineUsers } = useSocket();

    // Fetch Users
    const { data: usersData, isLoading: isUsersLoading } = useQuery<GetUsersQuery>({
        queryKey: ['chat-users'],
        queryFn: () => graphqlRequest(GetUsersDocument, { usersInput: { limit: 100, skip: 0 } })
    });

    // Generate Room ID: sorts the two user IDs so it's always the same for this pair
    const roomId = useMemo(() => {
        if (!currentUserId || !selectedUser) return null;
        return [currentUserId, selectedUser.id].sort().join("_");
    }, [currentUserId, selectedUser]);
   
    // Connect to the selected room
    const { messages: socketMessages, sendMessage, isConnected, typingUsers, sendTyping } = useChat(roomId || "", currentUserId || "");

    const { data: chatHistoryData, isLoading: isChatHistoryLoading } = useQuery<GetChatsQuery>({
        queryKey: ['chats', roomId],
        queryFn: () => graphqlRequest(GetChatsDocument, { roomId: roomId! }),
        enabled: !!roomId,
        refetchOnWindowFocus: false,
    });
 

    const addChatMutation = useMutation({
        mutationFn: (variables: AddChatMutationVariables) => 
            graphqlRequest(AddChatDocument, variables)
    });

    const allMessages = useMemo(() => {
        const history = chatHistoryData?.getChats?.map((msg: any) => ({
            id: msg._id,
            room: roomId!,
            sender: msg.senderId,
            text: msg.text,
            timestamp: msg.createdAt,
            isMe: msg.senderId === currentUserId
        })) || [];
        return [...history, ...socketMessages];
    }, [chatHistoryData, roomId, currentUserId, socketMessages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            sendMessage(messageInput);
            
            if (roomId && currentUserId) {
                addChatMutation.mutate({
                    addChatInput: {
                        roomId,
                        isRead:false,
                        senderId: currentUserId,
                        text: messageInput.trim()
                    }
                });
            }

            setMessageInput("");
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
        sendTyping(e.target.value.length > 0);
    }

    const users = usersData?.users?.items || [];
    
    // Get isTyping for selected user
    const isSelectedUserTyping = selectedUser && typingUsers.has(selectedUser.id);

    return (
        <Box sx={{ flexGrow: 1, p: 3, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                {/* Sidebar - User List */}
                <Grid  size={{xs:12,md:4 }} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <Box p={2}>
                            <Typography variant="h6">Chats</Typography>
                            <Typography variant="caption" color={isConnected ? "success.main" : "error.main"}>
                                {isConnected ? "Server Connected" : "Server Disconnected"}
                            </Typography>
                        </Box>
                        <Divider />
                        {isUsersLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                                {users.filter(u => u.id !== currentUserId).map((user) => {
                                    const isOnline = onlineUsers.has(user.id);
                                    return (
                                        <ListItem 
                                            component="div"
                                            key={user.id} 
                                            onClick={() => setSelectedUser({ id: user.id, name: user.name })}
                                            sx={{ 
                                                cursor: 'pointer',
                                                bgcolor: selectedUser?.id === user.id ? 'action.selected' : 'inherit',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Badge
                                                    overlap="circular"
                                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                    variant="dot"
                                                    color={isOnline ? "success" : "default"}
                                                >
                                                    <Avatar>{user.name[0]}</Avatar>
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={user.name} 
                                                secondary={user.email}
                                                secondaryTypographyProps={{ noWrap: true }}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </Paper>
                </Grid>

                {/* Main Content - Chat Area */}
                <Grid  size={{xs:12,md:8}} sx={{ height: '100%' }}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedUser ? (
                            <>
                                <Box p={2} sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {selectedUser.name}
                                        </Typography>
                                        <Typography variant="caption" color={onlineUsers.has(selectedUser.id) ? "success.main" : "text.secondary"}>
                                            {onlineUsers.has(selectedUser.id) ? "Online" : "Offline"}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                {/* Messages List */}
                                <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {isChatHistoryLoading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : (
                                        allMessages.map((msg, index) => (
                                            <Box 
                                                key={index} 
                                                sx={{ 
                                                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                                                    maxWidth: '70%',
                                                    bgcolor: msg.isMe ? 'primary.main' : 'grey.200',
                                                    color: msg.isMe ? 'white' : 'black',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    boxShadow: 1
                                                }}
                                            >
                                                <Typography variant="body1">{msg.text}</Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5, textAlign: 'right' }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                    {allMessages.length === 0 && !isChatHistoryLoading && (
                                        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
                                            Start a conversation with {selectedUser.name}
                                        </Typography>
                                    )}
                                    
                                    {/* Typing Indicator */}
                                    {isSelectedUserTyping && (
                                         <Box sx={{ alignSelf: 'flex-start', p: 1, fontStyle: 'italic' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {selectedUser.name} is typing...
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
        
                                {/* Input Area */}
                                <Divider />
                                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                                    <TextField 
                                        fullWidth 
                                        variant="outlined" 
                                        placeholder="Type a message..." 
                                        value={messageInput}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        autoComplete="off"
                                    />
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={handleSendMessage}
                                        disabled={!isConnected}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h6" color="textSecondary">
                                    Select a user to start chatting
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
