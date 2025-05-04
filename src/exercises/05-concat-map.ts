import {getPostsByUserObservable, getTodosManualObservable, getUsersByNameObservable} from "../common/common.ts";
import {concatMap, debounceTime, map, from, Subject, switchMap, tap, mergeMap} from "rxjs";

export const getUsersPosts = () => {
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
      <h2>🔍 Debounced User Search and posts</h2>
      <input id="search-input" type="text" placeholder="Type a user name..." />
      <ul id="user-list" class="user-list"></ul>
    `;
    const list = document.querySelector<HTMLUListElement>('#user-list')!;
    const input = document.querySelector<HTMLInputElement>('#search-input')!;
    const debounce = new Subject<string>();
    input.addEventListener('input', () => {
        debounce.next(input.value);
    })

    debounce
        .pipe(
            debounceTime(500),
            tap(() => list.innerHTML = ''),
            switchMap(() => getUsersByNameObservable(input.value)),
            map(users => users.map(user => ({username: user.name , userId: user.id}))),
            concatMap((users) => from(users)),
            mergeMap((user) => getPostsByUserObservable(user.userId).pipe(
                map(posts => ({ user, posts }))
            ))
        )
        .subscribe(({ user, posts }) => {
            const li = document.createElement('li');
                li.innerHTML = `
                <div class="user-header">👤 <strong>${user.username}</strong></div>
                <ul class="post-sublist">
                  ${posts.map(post => `<li>📝 ${post.title}</li>`).join('')}
                </ul>
          `;
            list.appendChild(li);
        });
}

export const getTodosManual = () => {
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
    <h2>⏱ Todos Emitted One by One</h2>
    <ul id="todo-list" class="todo-list"></ul>
  `;
    const list = document.querySelector<HTMLUListElement>('#todo-list')!;

    getTodosManualObservable().subscribe({
        next: (todo) => {
            const li = document.createElement('li');
            li.textContent = `✅ ${todo.title}`;
            list.appendChild(li);
        },
        error: (err) => {
            const errorLi = document.createElement('li');
            errorLi.textContent = `❌ Error: ${err.message}`;
            list.appendChild(errorLi);
        },
        complete: () => {
            const doneLi = document.createElement('li');
            doneLi.innerHTML = `<strong>🎉 All todos emitted!</strong>`;
            list.appendChild(doneLi);
        }
    });
};