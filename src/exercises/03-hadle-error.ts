import { catchError, of } from "rxjs"
import { getWrongEndpointObservable } from "../common/common"

export const getWrongEndpoint = () => {
    const output = document.querySelector<HTMLDivElement>('#output')!;
    getWrongEndpointObservable()
        .pipe(
            catchError(() => of([]))
        )
        .subscribe(users => {
            if (users.length === 0) {
                output.innerHTML = `<h2>😰 No data found</h2>`;
            }      
        })
}