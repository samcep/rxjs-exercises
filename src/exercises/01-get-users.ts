import {catchError, concatMap, forkJoin, from, map, of, retry, timer} from "rxjs"
import {
    getPostsByUserObservable,
    getPostsObservable,
    getUsersObservable,
    getWrongEndpointObservable
} from "../common/common"


export const getUsers = () => { 
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
      <h2>👤 Users</h2>
      <ul id="user-list" class="user-list"></ul>
    `;
  
    const list = document.querySelector<HTMLUListElement>('#user-list')!;
  
    getUsersObservable()
      .pipe(catchError(() => of([])))
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
      });
  };

export const getUsersByNameStartingAtC =  () => { 
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
        <h2>👤 Users by name starting with 'C'</h2>
        <ul id="user-list" class="user-list"></ul>
    `;

    const list = document.querySelector<HTMLUListElement>('#user-list')!;

    getUsersObservable()
        .pipe(
        map(users => users.filter(user => user.name.startsWith('C'))),
        catchError(() => of([]))
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
        });
}

export const getUsersAndPosts = () => {
    const output = document.querySelector<HTMLDivElement>('#output')!;
    forkJoin({
      users: getUsersObservable(),
      posts: getPostsObservable()
    }).pipe(
      catchError(() =>  {
        output.innerHTML = `<h2>😞 Something went wrong</h2>`;
        return of({ users: [], posts: [] })
      }
        
    )
    ).subscribe({
      next: ({ users, posts }) => {
        if(users.length > 0 || posts.length > 0) { 
            output.innerHTML = `
              <h2>📚 Users and Posts</h2>
              <div><strong>Users:</strong></div>
              <ul id="user-list"></ul>
              <div><strong>Posts:</strong></div>
              <ul id="post-list"></ul>
            `;
            
            const userList = document.querySelector<HTMLUListElement>('#user-list')!;
            const postList = document.querySelector<HTMLUListElement>('#post-list')!;
      
            users.forEach(user => {
              const li = document.createElement('li');
              li.innerHTML = `<span>${user.name}</span>`;
              userList.appendChild(li);
            });
      
            posts.forEach(post => {
              const li = document.createElement('li');
              li.innerHTML = `<span>${post.title}</span>`;
              postList.appendChild(li);
            });
        }
      }
    });
  };

export const getUsersAndPostsHandleErrorPerObservable = () => { 
    const output = document.querySelector<HTMLDivElement>('#output')!;
    forkJoin({
        users: getUsersObservable().pipe(
            catchError(() =>  {
                return of([])
            })
        ),
        posts: getPostsObservable().pipe(
            catchError(() =>  {
              return  of([])
            })
        )
    })
    .subscribe({
        next: ({ users, posts }) => {
          if(users.length > 0 || posts.length > 0) { 
              output.innerHTML = `
                <h2>📚 Users and Posts</h2>
                <div><strong>Users:</strong></div>
                <ul id="user-list"></ul>
                <div><strong>Posts:</strong></div>
                <ul id="post-list"></ul>
              `; 
              const userList = document.querySelector<HTMLUListElement>('#user-list')!;
              const postList = document.querySelector<HTMLUListElement>('#post-list')!;
        
              users.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${user.name}</span>`;
                userList.appendChild(li);
              });
        
              posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${post.title}</span>`;
                postList.appendChild(li);
              });
          }else { 
            output.innerHTML = `<h2>❌ Couldn't load users or posts</h2>`;
          }
        }
      });
}

export const getUsersRetry  = () => { 
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML =  ''
    getWrongEndpointObservable()
    .pipe(
        retry(2), 
        catchError(() => {
            output.innerHTML = `<h2>❌ Failed after 2 retries (see console errors)</h2>`;
            return of([]);
        })
    )
    .subscribe({
        next: () => console.log('Nice! ')
    })
}


export const getUsersAndPostsOneByOne = () => {
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = `
        <h2>👤 Fetching users and posts one by one</h2>
        <button id="cancel-btn">❌ Cancel</button>
        <ul id="user-list"></ul>
    `;
    const list = document.querySelector<HTMLUListElement>('#user-list')!;
    const cancelBtn = document.querySelector<HTMLButtonElement>('#cancel-btn')!;

    const subscription = getUsersObservable()
        .pipe(
            concatMap(users =>
                from(users).pipe(
                    concatMap(user => timer(1000).pipe(map(() => user)))
                )
            ),
            concatMap(user =>
                getPostsByUserObservable(user.id).pipe(
                    map(posts => ({ user, posts }))
                )
            )
        )
        .subscribe({
            next: ({ user, posts }) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div><strong>👤 ${user.name}</strong></div>
                    <ul>
                        ${posts.map(p => `<li>📝 ${p.title}</li>`).join('')}
                    </ul>
                `;
                list.appendChild(li);
            },
            complete: () => {
                output.innerHTML += `<p>✅ All done!</p>`;
            },
            error: (err) => {
                output.innerHTML += `<p style="color: red;">❌ Error: ${err.message}</p>`;
            }
        });

    cancelBtn.addEventListener('click', () => {
        subscription.unsubscribe();
        output.innerHTML += `<p style="color: orange;">⚠️ Operation cancelled</p>`;
    });
};
