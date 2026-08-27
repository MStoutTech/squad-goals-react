let currentToken = null;

export function setCurrentToken(token){
    currentToken = token;
}

export async function apiFetch (path, options={}){
    function fetchWithCredentials(){ return fetch(path, {...options, headers:{...options.headers, "x-csrf-token": currentToken}, credentials: "include"})}    

    let response = await fetchWithCredentials()

     if(response.status === 403){
         response = await fetchWithCredentials();
     }

     return response
    
} 