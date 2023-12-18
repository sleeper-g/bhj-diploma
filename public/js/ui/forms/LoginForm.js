/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if (response.success){
        document.forms["login-form"].reset();
        App.getModal("login").close();
        App.setState("user-logged");
      } else {
        console.error(response.error);
        alert(response.error);
      };
    });
  };
};