const handlelogin = async () => {
  const userIdInput = document.getElementById("user_input_Id");
  const passwordInput = document.getElementById("password");

  const userid = userIdInput.value;
  const password = passwordInput.value;

  const user = {
    userid: userid,
    password: password,

  };

 const userInfo = await fetchUserInfo(user);
 console.log(userInfo);
 const errorElement =document.getElementById("user-login-error");

 //user data did not match with database


 if(userInfo.length === 0 ){
 errorElement.classList.remove("hidden");
 }
 else{
  errorElement.classList.add("hidden"); 

  //save user infomation
 localStorage.setItem("loggedInUser" , JSON.stringify(userInfo[0]));
  window.location.href = "./post.html";
 }

};

const fetchUserInfo = async (user) => {
  let data;
  try {
    const res = await fetch('http://localhost:5000/getUserInfo' , {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    });

    data = await res.json();

  }
  catch (err) {
    console.log("Error connection to the server: ", err);

  }

  finally {
    return data;
  }
};