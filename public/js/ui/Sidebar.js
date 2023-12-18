/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  };

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    this.button = document.querySelector('.sidebar-toggle');
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('sidebar-collapse');
      document.body.classList.toggle('sidebar-open');
    });

  };

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const registerBtn = document.querySelector('.menu-item_register');
    const loginBtn = document.querySelector('.menu-item_login');
    const logoutBtn = document.querySelector('.menu-item_logout');

    registerBtn.addEventListener('click', (buttonEl) => {
      buttonEl.preventDefault();
      App.getModal('register').open();
    });

    loginBtn.addEventListener('click', (buttonEl) => {
      buttonEl.preventDefault();
      App.getModal('login').open();
    });

    logoutBtn.addEventListener('click', (buttonEl) => {
      buttonEl.preventDefault();
      User.logout( (err, response) => {
        if (response && response.success){
          App.setState('init');
        };
      });
    });


  };
};