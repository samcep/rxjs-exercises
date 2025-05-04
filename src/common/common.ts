import {defer, from, map, Observable , concatMap, timer} from 'rxjs'
import { Post, User  , Todo} from '../interfaces/json-placeholder.interface'

export const getUsersObservable = (): Observable<User[]> => {
    return defer(() => from(
      fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          return response.json();
        })
    ));
  }
export const getUsersByNameObservable = (name: string): Observable<User[]> => {
    return defer(() => from(
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
    ).pipe(map((users: User[]) => users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()))))
    );
}
  
  export const getPostsObservable = (): Observable<Post[]> => {
    return defer(() => from(
      fetch('https://jsonplaceholder.typicode.com/posts')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch posts');
          }
          return response.json();
        })
    ));
  }
  
  export const getWrongEndpointObservable = (): Observable<User[]> => {
    return defer(() => from(
      fetch('https://jsonplaceholder.typicode.com/wrong-endpoint')
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network error: Wrong endpoint'); 
          }
          return res.json() as Promise<User[]>;
        })
    ));
  }

export const getPostsByUserObservable = (userId: number): Observable<Post[]> => {
    return defer(() => from(
            fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch users');
                    }
                    return response.json();
                })
        )
    );
}

export const getTodosManualObservable = (): Observable<Todo> => {
    return new Observable<Todo>(subscriber => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(res => res.json())
            .then((todos: Todo[]) => {
                from(todos)
                    .pipe(
                        concatMap(todo => timer(1000).pipe(
                            map(() => todo)
                        ))
                    )
                    .subscribe({
                        next: todo => subscriber.next(todo),
                        complete: () => subscriber.complete(),
                        error: err => subscriber.error(err)
                    });
            })
            .catch(err => subscriber.error(err));
    });
};


