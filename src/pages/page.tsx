 
export function PageContent({title,children}:{title:string,children:any}){
    return(
        <div className='page'  >
            <h1>{title}</h1>
            {children}
        </div>
    )
}