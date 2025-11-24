const fatchAllPosts = async () => {
  let data;

  try {
    const res = await fetch("http://localhost:5000/getAllPosts");
    data = await res.json();
    // console.log(data);
    showAllPosts(data);

  }
  catch (err) {
    console.log("Error fetching data from server")
  }
};

const showAllPosts = (allposts) => {
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = "";


  allposts.forEach(async (posts) => {
    // console.log("Full post object:", post);
    // console.log("Post ID:", posts.postId);
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');

    postDiv.innerHTML = ` 
            <div class="post-header">
                <div class="post-user-image">
                  <img src=${posts.postedUserImage}
                  />
                </div>

                 <div class="post-user-time">
                  
                      <p class="post-username">${posts.postedUserName}</p>
                     <div class="posted-time">
                     <span>${posts.postedTime}</span>
                     <span>hours ago</span>
                   </div>
                 </div>
            </div>
              
            <div class="post-text">
                <p class="post-text-content">
                    ${posts.postedText}
                </p>
            </div>

            <div class="post-image">
              <img src=${posts.postedImageUrl} />
            </div>
         
       
 `;

    postContainer.appendChild(postDiv);

    //comments under a post
    let postComments = await fatchAllCommentsOfPost(posts.postId)
    console.log("postComments: ", postComments);

    postComments.forEach(comment => {
      const commentsHolderDiv = document.createElement('div');
      commentsHolderDiv.classList.add('comments-holder');
      commentsHolderDiv.innerHTML =`
      <div class="comment">
                <div class="comment-user-image">
                    <img src=${comment.commentedUserImage}
                    />
                </div>
                <div class="comment-text-container">
                    <h3>${comment.commentedUserName}</h3>
                    <p class="comment-text">
                        ${comment.commentText}
                    </p>
                </div>
            </div>
      `;
      postDiv.appendChild(commentsHolderDiv);
    });

    //adding a new comment to the post

    const addNewCommentDiv =document.createElement('div');
    addNewCommentDiv.classList.add('postComment-holder');
    addNewCommentDiv.innerHTML=`
            <div class="post-comment-input-field-holder">
                 <input type="text" 
                 placeholder="post your comment" 
                 class="postCommen-input-field"
                  id="postComment-input-for-postId1"
                  />
                  </div>
                  <div class="comment-btn-holder">
                  <button id="comment-btn" class="postComment-btn">
                    comment
                </button>
            </div>
    `;
   
  postDiv.appendChild(addNewCommentDiv);

  });
};


const fatchAllCommentsOfPost = async (postId) => {
  let CommentsOfPost = [];
  try {
    const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
    CommentsOfPost = await res.json();
  }

  catch (err) {
    console.log("Error fetching from the server: ", err);
  }
  finally {
    return CommentsOfPost;
  }

};



fatchAllPosts();