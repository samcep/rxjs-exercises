import {
  getUsers,
  getUsersAndPosts,
  getUsersAndPostsHandleErrorPerObservable,
  getUsersAndPostsOneByOne,
  getUsersByNameStartingAtC,
  getUsersRetry
} from './exercises/01-get-users'
import {getPosts, getPostsTitles} from './exercises/02-get-posts'
import { getWrongEndpoint } from './exercises/03-hadle-error'
import { getDebouceInput } from './exercises/04-debounced-inputs'
import './style.css'
import rxjsLogo from '/rxjs.svg'
import {getTodosManual, getUsersPosts} from "./exercises/05-concat-map.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a target="_blank">
      <img src="${rxjsLogo}" class="logo" alt="RxJS logo" />
    </a>
    <h1>RxJS + TypeScript</h1>
    <ul id="exercise-list">
      <li><button data-exercise="Fetch all users">Fetch all users</button></li>
      <li><button data-exercise="Fetch all posts">Fetch all posts</button></li>
      <li><button data-exercise="Filter users by name starting with 'C'">Filter users by name starting with 'C'</button></li>
      <li><button data-exercise="Handle error with catchError() and fallback with of()">Handle error with catchError() and fallback with of()</button></li>
      <li><button data-exercise="Fetch users and posts together using forkJoin()">Fetch users and posts together using forkJoin()</button></li>
      <li><button data-exercise="Handle HTTP errors with forkJoin and catchError per observable">Handle HTTP errors with forkJoin and catchError per observable</button></li>
      <li><button data-exercise="Retry fetching users 2 times if it fails">Retry fetching users 2 times if it fails</button></li>
      <li><button data-exercise="Debounced Search Input for Users">Debounced Search Input for Users</button></li>
      <li><button data-exercise="Get only post titles">Get only post titles</button></li>
      <li><button data-exercise="fetch posts per user">fetch posts per user</button></li>
      <li><button data-exercise="Manual Observable Emitting Todos">Manual Observable Emitting Todos</button></li>
      <li><button data-exercise="fetch users and posts one by one">fetch users and posts one by one</button></li>
    </ul>
    <div id="output"></div>
  </div>
`
 
const exercises: Record<string, () => void> = {
  'Fetch all users' : getUsers,
  'Fetch all posts' : getPosts,
  "Filter users by name starting with 'C'" : getUsersByNameStartingAtC,
  "Handle error with catchError() and fallback with of()" :  getWrongEndpoint,
  "Fetch users and posts together using forkJoin()" : getUsersAndPosts,
  "Handle HTTP errors with forkJoin and catchError per observable" : getUsersAndPostsHandleErrorPerObservable,
  "Retry fetching users 2 times if it fails" : getUsersRetry,
  "Debounced Search Input for Users" : getDebouceInput,
  "Get only post titles" : getPostsTitles,
  "fetch posts per user" : getUsersPosts,
  "Manual Observable Emitting Todos" : getTodosManual,
  "fetch users and posts one by one" : getUsersAndPostsOneByOne
}

document.querySelectorAll<HTMLButtonElement>('#exercise-list button').forEach(button => {
  button.addEventListener('click', () => {
    const exerciseName = button.dataset.exercise
    if (exerciseName && exercises[exerciseName]) {
      document.querySelector<HTMLDivElement>('#output')!.innerHTML = `<p>Running ${exerciseName} , see the console...</p>`
      exercises[exerciseName]()
    }
  })
})
