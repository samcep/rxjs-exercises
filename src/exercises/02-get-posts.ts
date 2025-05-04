import {catchError, map, of} from "rxjs"
import { getPostsObservable } from "../common/common"


export const getPosts = () => { 
    
    const output = document.querySelector<HTMLDivElement>('#output')!;
    output.innerHTML = ''
    output.innerHTML = `
      <h2>Posts</h2>
      <ul id="post-list" class="post-list"></ul>
    `;
    const list = document.querySelector<HTMLUListElement>('#post-list')!;
    getPostsObservable()
      .pipe(catchError(() => of([])))
      .subscribe({
        next: (posts) => {
          if (Array.isArray(posts)) {
            list.innerHTML = '';
            posts.forEach(post => {
              const li = document.createElement('li');
                li.innerHTML = `
                <span class="post-icon">🗒️</span>
                <div class="post-content">
                    <div class="post-title">${post.title}</div>
                    <div class="post-body">${post.body}</div>
                </div>
                `;
                list.appendChild(li);
            });
          }
        }
      });
  };
  export  const getPostsTitles = () => {
      const output = document.querySelector<HTMLDivElement>('#output')!;
      output.innerHTML = ''
      output.innerHTML = `
      <h2>Posts</h2>
      <ul id="post-list" class="post-list"></ul>
    `;
      const list = document.querySelector<HTMLUListElement>('#post-list')!;
      getPostsObservable()
      .pipe(
          map((posts) => posts.map(post => post.title)),
          catchError(() => of([]))
      )
      .subscribe({
          next: (posts) => {
              if (Array.isArray(posts)) {
                  list.innerHTML = '';
                  posts.forEach(post => {
                      const li = document.createElement('li');
                      li.innerHTML = `
                        <span class="post-icon">🗒️</span>
                        <div class="post-content">
                            <div class="post-title">${post}</div>
                        </div>
            `;
                      list.appendChild(li);
                  });
              }
          }
      });
  }