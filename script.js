'use strict';

import UsersFromServer from './small_base.js';
// import UsersFromServer from '/big_base.js';
/*
function getUsersFromServer() {
  let xhr = new XMLHttpRequest();

  xhr.open('GET', '//www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D', false);
  xhr.send();

  if (xhr.status != 200) {
    alert('Ошибка ' + xhr.status + ': ' + xhr.statusText);
  } else {
    return JSON.parse(xhr.responseText);
  }
}
*/
class newTable {
  constructor(element, users) {
    this.element = element;
    this.users = users;
    this.sortOrder = 'A to Z';
    this.elemForSortDirection;
    this._render();
    
    this.element.querySelector('.tableUser').addEventListener('click', this._sort);
  }
  
  _sort(event) {
    let target;
    
    switch(event.target.nodeName) {
      case 'TH':
        target = event.target;
        break;
      case 'SPAN':
        target = event.target.parentElement;
        break;
      default: 
        return;
    }
    
    let contentsTable = document.querySelector('.tableUser tbody');
    let arrayToSort = [].slice.call(contentsTable.rows);
    let numberRows = contentsTable.children.length;
    let numberOfHeading = target.cellIndex;
    let dataType = target.dataset.type;
    
    if (this.elemForSortDirection) {
      this.elemForSortDirection.className = '';
    }
    
    if (this.sortOrder === 'A to Z') {
      if (dataType === 'number') {
        arrayToSort.sort((a, b) => {
          a = +a.children[numberOfHeading].textContent;
          b = +b.children[numberOfHeading].textContent;
          return +a - +b;
        });
      } else {
        arrayToSort.sort((a, b) => {
          a = a.children[numberOfHeading].textContent;
          b = b.children[numberOfHeading].textContent;
          if (a > b) return 1;
          if (a < b) return -1;
        });
      }
      this.elemForSortDirection = target.querySelector('span');
      this.elemForSortDirection.classList.add('sortAZ');
      this.sortOrder = 'Z to A';
    } else {
      if (dataType === 'number') {
        arrayToSort.sort((a, b) => {
          a = +a.children[numberOfHeading].textContent;
          b = +b.children[numberOfHeading].textContent;
          return +b - +a;
        });
      } else {
        arrayToSort.sort((a, b) => {
          a = a.children[numberOfHeading].textContent;
          b = b.children[numberOfHeading].textContent;
          if (a < b) return 1;
          if (a > b) return -1;
        });
      }
      this.elemForSortDirection = target.querySelector('span');
      this.elemForSortDirection.classList.add('sortZA');
      this.sortOrder = 'A to Z';
    }
    
    for (let i = 0; i < numberRows; ++i) {
      contentsTable.appendChild(arrayToSort[i]);
    }
  }
  
  _render() {
    this.element.innerHTML = `
      <table class="tableUser">
        <thead>
          <tr onmousedown="return false">
            <th data-type="number">ID<span></span></th>
            <th data-type="string">firstName<span></span></th>
            <th data-type="string">lastName<span></span></th>
            <th data-type="string">email<span></span></th>
            <th data-type="string">phone<span></span></th>
            <th data-type="string">address<span></span></th>
            <th data-type="string">description<span></span></th>
          </tr>
        </thead>
        <tbody>
          ${
            this.users
              .map((user) => `
                <tr>
                  <td>${ user.id }</td>
                  <td>${ user.firstName }</td>
                  <td>${ user.lastName }</td>
                  <td>${ user.email }</td>
                  <td>${ user.phone }</td>
                  <td>${ user.address.streetAddress + ', ' + 
                         user.address.city + ', ' + 
                         user.address.state + ', ' + 
                         user.address.zip
                       }</td>
                  <td>${ user.description }</td>
                </tr>
              `)
              .join('')
          }
        </tbody>
      </table>
    `
  }
}

let table1 = new newTable(document.querySelector('#container'), UsersFromServer);

class Filter {
  constructor(element) {
    this.element = element;
    this._render();
    this.contentsTable = document.querySelector('.tableUser tbody');
    
    this.element.querySelector('.start-filtering').addEventListener('click', this._filter.bind(this));
    this.element.querySelector('.cancel-filtering').addEventListener('click', this._cancelFilter.bind(this));
  }
  
  _render() {
    this.element.innerHTML = `
    <p>Фильтр</p>
    <input class="filter-string" type="text">
    <button class="start-filtering">Найти</button>
    <button class="cancel-filtering">Отмена</button>
    `
  }
  
  _filter() {
    let searchQuery = document.querySelector('.filter-string').value;
    let numberRows = this.contentsTable.children.length;
    
    for (let i = 0; i < numberRows; ++i) {
      if (this.contentsTable.children[i].textContent.toLowerCase().includes( searchQuery.toLowerCase() )) {
        this.contentsTable.children[i].style.display = '';
        continue;
      }
      
      this.contentsTable.children[i].style.display = 'none';
    }
  }
  
  _cancelFilter() {
    let numberRows = this.contentsTable.children.length;
    
    for (let i = 0; i < numberRows; ++i) {
      this.contentsTable.children[i].style.display = '';
    }
    
    document.querySelector('.filter-string').value = '';
  }
}

let filter = new Filter(document.querySelector('#filter'));
