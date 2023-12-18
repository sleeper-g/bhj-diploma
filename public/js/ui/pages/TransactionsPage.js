/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (element){
      this.element = element;
      this.registerEvents();
      this.lastOptions = null;
    } else {
      throw new Error('передан пустой элемент в TransactionsPage');
    }
  };

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions){
      this.render(this.lastOptions);
    };
  };

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', () => {
      this.removeAccount();
    });

    this.element.querySelector('.content').addEventListener('click', (e) => {
      const element = e.target.closest('button.transaction__remove');
      if (element) {
        this.removeTransaction(element.dataset.id);
      };
    });
  };

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions){
      if ( window.confirm('Вы действительно хотите удалить счёт?')){
        this.clear();
        const id = document.querySelector('li.active').dataset.id;
        Account.remove( {id:id}, (err, response) => {
          if (response.success){
            this.clear();
            App.update();
          };
        });
      };
    };
  };

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (window.confirm('Вы действительно хотите удалить эту транзакцию?')){
      Transaction.remove( {id: id}, (err, response) => {
        if (response.success) {
          App.update()
        };
      });
    };
  };

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
        };
      });
      Transaction.list(options, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        };
      });
    };
  };

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions();
    this.renderTitle("Название счёта");
  };

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    return new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    })
      .format(Date.parse(date))
      .replace(",", " в");
  };

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
        ${item.sum}
        <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector(".content");
    let transHTML = "";

    data.forEach(item => {
      transHTML += this.getTransactionHTML(item);
    });
    content.innerHTML = transHTML;
  };
};
