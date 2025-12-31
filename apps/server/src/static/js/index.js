document.addEventListener('DOMContentLoaded',() => {
  const loginform = document.getElementById('loginForm');

  if(loginform){
    loginform.addEventListener('submit',function(e){
      e.preventDefault();
      const form = new FormData(loginform);
      // const data = Object. 
      console.log(data)
    });
  }
});