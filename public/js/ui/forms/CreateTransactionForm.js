/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.element = element;
    this.renderAccountsList();
  };

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accList = this.element.querySelector("select.accounts-select");
    accList.innerHTML = "";
    const data = User.current();
    Account.list(data, (err, response) => {
      if (response.success) {
        response.data.forEach((accEl) =>
          accList.insertAdjacentHTML(
            "beforeend",
            `<option value="${accEl.id}">${accEl.name}</option>`
          )
        )
      }
    })

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        if (this.element.id === "new-income-form") {
          App.getModal("newIncome").close();
          App.getModal("newIncome").element.querySelector("form").reset();
        }
        else {
          App.getModal("newExpense").close();
          App.getModal("newExpense").element.querySelector("form").reset();
        }
        App.update();
      }
      else {
        console.error(err);
        alert(err);
      };
    });
  };
};