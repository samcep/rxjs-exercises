import {debounceTime, fromEvent, switchMap} from "rxjs";
import {getUsersByNameObservable} from "../common/common.ts";


export const getDebouceInput = () => { 
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
      <h2>🔍 Debounced User Search</h2>
      <input id="search-input" type="text" placeholder="Type a user name..." />
      <ul id="user-list" class="user-list"></ul>
    `;
    const list = document.querySelector<HTMLUListElement>('#user-list')!;
    const input = document.querySelector<HTMLInputElement>('#search-input')!;
    fromEvent<InputEvent>(input, 'input')
        .pipe(
            debounceTime(500),
            switchMap(() => getUsersByNameObservable(input.value)),
        )
        .subscribe({
            next: (users) => {
                if (Array.isArray(users)) {
                    list.innerHTML = '';
                    users.forEach(user => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <span class="user-icon">👨‍💻</span>
                            <span class="user-name">${user.name}</span>
                            <span class="user-email">📧 ${user.email}</span>
              `;
                        list.appendChild(li);
                    });
                }
            }
        })
}