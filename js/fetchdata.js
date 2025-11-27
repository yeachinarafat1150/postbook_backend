const showLoggedUsername = () =>{
  const userNameElement = document.getElementById('logged-username');

//find username from localstorage

let user = localStorage.getItem('loggedInUser');
if(user){
  user = JSON.parse(user);
}

//show username in the webpage

userNameElement.innerText = user.userName;

};

const checkLoggedInUser = () =>{
  let user = localStorage.getItem('loggedInUser');
if(user){
  user=JSON.parse(user);
}
else{
  window.location.href = "/index.html";
}
};

const logOut = () =>{
  //clearing the localstorage
  localStorage.clear();
  checkLoggedInUser();
};

const fetchAllPosts = async () => {
  try {
    const res = await fetch("http://localhost:5000/getAllPosts");
    const data = await res.json();
    showAllPosts(data);
  } catch (err) {
    console.log("Error fetching posts:", err);
  }
};

const showAllPosts = (allposts) => {
  const postContainer = document.getElementById("post-container");
  postContainer.innerHTML = "";

  allposts.forEach(async (post) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    postDiv.innerHTML = `
      <div class="post-header">
        <div class="post-user-image">
          <img src="${post.postedUserImage}" />
        </div>
        <div class="post-user-time">
          <p class="post-username">${post.postedUserName}</p>
          <div class="posted-time">
            <span>${timeDifference(`${post.postedTime}`)}</span>
            <span>ago</span>
          </div>
        </div>
      </div>

      <div class="post-text">
        <p class="post-text-content">${post.postedText}</p>
      </div>

      <div class="post-image">
        <img src="${post.postedImageUrl}" />
      </div>
    `;

    postContainer.appendChild(postDiv);

    
    // LOAD COMMENTS OF THIS POST
    
    let postComments = await fetchAllCommentsOfPost(post.postId);

    postComments.forEach((comment) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comments-holder");

      commentDiv.innerHTML = `
        <div class="comment">
          <div class="comment-user-image">
            <img src="${comment.commentedUserImage}" />
          </div>
          <div class="comment-text-container">
            <h3>${comment.commentedUserName}</h3>
            <p class="comment-text">${comment.commentText}</p>
          </div>
        </div>
      `;

      postDiv.appendChild(commentDiv);
    });

    
    // COMMENT INPUT 
    
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("postComment-holder");

    inputDiv.innerHTML = `
      <div class="post-comment-input-field-holder">
        <input 
          type="text" 
          placeholder="post your comment" 
          class="postComment-input-field"
          id="comment-input-${post.postId}"
        />
      </div>
      <div class="comment-btn-holder">
        <button 
          onClick="handlePostComment(${post.postId})"
          class="postComment-btn"
        >
          comment
        </button>
      </div>
    `;

    postDiv.appendChild(inputDiv);
  });
};


// POST A NEW COMMENT

const handlePostComment = async (postId) => {
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return alert("Login first!");

  const commentedUserId = user.userId;
  const inputField = document.getElementById(`comment-input-${postId}`);
  const commentText = inputField.value;

  if (!commentText.trim()) return alert("Write something!");

  //current time of comment
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let commentTime = now.toISOString();

  const commentObject = {
    commentOfPostId: postId,
    commentedUserId,
    commentText,
    commentTime,
  };

  try {
    await fetch("http://localhost:5000/postComment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(commentObject),
    });
  } catch (err) {
    console.log("Error while sending data to the server:", err);
  } finally {
    location.reload();
  }
};


// FETCH COMMENTS OF A POST

const fetchAllCommentsOfPost = async (postId) => {
  try {
    const res = await fetch(`http://localhost:5000/getAllComments/${postId}`);
    return await res.json();
  } catch (err) {
    console.log("Error fetching comments:", err);
    return [];
  }
};

const handleAddNewPost =async () => {
  
  //getting user id from localstorage
  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) return alert("Login first!");

  const postedUserId = user.userId;

  //current time of post
  let now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  let timeOfPost = now.toISOString();

  //post text
const postTextElement = document.getElementById('newPost-text');
const postText = postTextElement.value;

//post image

const postImageElement = document.getElementById('newPost-image');
const postImageUrl = postImageElement.value;

//creating a post object

const postObject ={
  postedUserId : postedUserId,
  postedTime : timeOfPost,
  postedText :postText,
  postedImageUrl:postImageUrl,
};

try {
    await fetch("http://localhost:5000/addNewPost", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(postObject),
    });
  } catch (err) {
    console.log("Error while sending data to the server: ", err);
  } finally {
    location.reload();
  }

// console.log("sending data to server:  ",postObject);

};

//this function automatically runs
fetchAllPosts();

showLoggedUsername();
