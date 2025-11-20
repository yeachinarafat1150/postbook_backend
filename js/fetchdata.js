const fatchAllPosts = async() => {
    let data;

    try{
         const res = await fetch("http://localhost:5000/getAllPosts");
         data = await res.json();
         console.log(data);
         showAllPosts(data);

    }
    catch(err){
    console.log("Error fetching data from server")
    }
};

const showAllPosts = (allposts) => {
 const postContainer = document.getElementById ('post-container');
 postContainer.innerHTML = "";


 allposts.forEach(post => {
 const postDiv = document.createElement('div');
 postDiv.classList.add('post');

 postDiv.innerHTML =` 
            <div class="post-header">
                <div class="post-user-image">
                  <img src=${post.postedUserImage}
                  />
                </div>

                 <div class="post-user-time">
                  
                      <p class="post-username">${post.postedUserName}</p>
                     <div class="posted-time">
                     <span>${post.postedTime}</span>
                     <span>hours ago</span>
                   </div>
                 </div>
            </div>
              
            <div class="post-text">
                <p class="post-text-content">
                    ${post.postedTex}
                </p>
            </div>

            <div class="post-image">
              <img src=${post.postedImageUrl} />
            </div>
         
       
 `;

 postContainer.appendChild(postDiv);
 });
};

fatchAllPosts();