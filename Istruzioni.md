# installare/aggiornare rxjs
terminale da code: npm instal --save rxjs-compat

# sintassi observable
```
.subscribe(
	()=>{},		//new data
	()=>{},		//error
	()=>{}		//completato

)
```
# creare observables
```
import {Observable} from "rxjs/Observable"
import "rxjs/Rx"
```
```
ngOnInit(){
	const example = Observable.interval(1000) //creo un observable che manda dati ogni 1000 millisecondi
	example.subscribe(
		(numero: number)=>{
			console.log(numero);		//stamper� 1,2,3,4,5 ecc ogni secondo, fornito automaticamente da una libreria
		}
	)
	//BISOGNA RICORDARSI DI UNSUBSCRIBE, altrimenti l'observable rimarr� attivo anche fuori dal component
}
```
# creare observable metodo 2
```
import {Observable} from "rxjs/Observable"
import "rxjs/Rx"
import {Observer} from "rxjs/Observer"
```
```
ngOnInit(){
	const example = Observable.create(
	(observer: Observer<string>)=>{		//funzione che regola l'emissione di dati per l'observer. SPECIFICO IL TIPO DI DATI
		//codice vario (es setInterval per emettere dati ogni tot secondi)
		observer.next("first package");		//emette un dato
		//codice vario
		observer.next("second package");
		//blabla
		observer.error("ops!"); //emette un errore

		//altro codice
		observer.complete();		//completa il processo. Dopo questo nessun altro dato verr� inviato
	}
	);

//facciamo il subscribe
example.subscribe(
	(data: string)=>{		//so che � una stringa perch� sono io che ho creato l'observable
	console.log("nuovo dato: "+data);
	},
	(error: string)=>{
		console.log("errore: "+error);
	}
	()=>{
		console.log("completato");
	}
);
}
```

# unsubscribe observable
quando si crea un observable lo si associa ad una variabile di tipo Subscription,
generalmente in ngOnDestroy si scrive
```
nomeVariabile.unsubscribe();
```

# Subject
Un subject � un observable e un observer allo stesso tempo. E' quindi possibile emettere nuovi dati quando si vuole in ogni parte dell'applicazione
```
variabileReferenza.next("valore");
```
Utilizzando il normale subscribe, � possibile riprendere il valore che � stato passato



# Reactive form
non necessita di importare FormsModule in appModule ma ReactiveFormsModule
nel component si scrive:
```
import {FormControl, FormGroup} from '@angular/forms'
signupForm: FormGroup;
ngOnInit(){
	this.signupForm = new FormGroup({	//oggetto con tutti i controlli del form (dati che bisogna inserire)
		'username': new FormControl(null),	//come argomenti: 1-defaultValue (null per campo vuoto) 2-array di validators, 3-validator asincrono
		//altri controlli
	});
}
```
# Collegare il reactive form al form nel template
```
<form [formGroup]="signupForm">		//nome della variabile nel component
	<input formControlName="username">	//nome del controllo
</form>
```
# Submit reactive form
aggiungere (ngSubmit)="onSubmit()" al tag form
```
//la differenza dal template-driven form � che abbiamo gi� una referenza al nostro form (signupForm)
onSubmit(){
	console.log(this.signupForm);
}
```

# Validare il reactive form
non si aggiunge required al template perch� il form � configurato nel component
si aggiunge al form control un validator:
```
'username': new FormControl(null,Validators.required);
/*
va importato Validators (NO PARENTESI required()) perch� non eseguiamo il metodo ma gli passiamo una referenza. Angular eseguir� il metodo per controllare se l'input � valido
*/

'email' : new FormControl(null,[Validators.required,Validators.email]);	//esempio con array di validators
```



# Importare firebase in angular:
in app.module.ts
```
import {AngularFireModule} from 'angularfire2'
import {AngularFirestoreModule} from 'angularfire2/firestore'

imports: [
AngularFireModule.initializeApp(environment.firebase),
AngularFirestoreModule
]
```
```
//nel component che ci interessa
books : Observable<any[]>
constructor(bd: AngularFirestore){
	this.books = db.collection("books").valueChanges();
}
```
```
//nell'html del component
<ul>
	<li *ngFor="let book of books | async">{{book.title}}</li>
</ul>
```

# Responsive material application
Richiesta la toolbar (header)
Richiesto sidenav

# generare responsive sidenav da terminale
ng generate @angular/material:material-nav --name=nome-component
Viene già aggiunto ad app.module.ts
Per usarlo nel component usare il tag nome-component

# !operator in typescript
Esempio
```
(observer|async)!.proprietà
/*
Il ! controlla che l'oggetto restituito dall'observer sia diverso da null, per non dare errore
"cannot get proprietà of null"
*/
```

# impostare elementi sulla parte destra dello schermo
```
<span class="spacer"></span>
<tag da spostare a destra (notare che è fuori dallo span)>
```
nel css
```
.span{
	flex: 1 1 auto;
}
```

# query params
```
[queryParams] = "{}"