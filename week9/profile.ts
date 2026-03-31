import { CommonModule } from '@angular/common'; 
import { HttpClient,HttpClientModule } from '@angular/common/http'; 
import { Component,OnInit } from '@angular/core'; 
@Component({ 
selector: 'app-profile', 
standalone:true, 
imports: [HttpClientModule,CommonModule], 
templateUrl: './profile.html', 
styleUrl: './profile.css' 
}) 
export class Profile implements OnInit{ 
user:any 
constructor(private http:HttpClient){ 
} 
ngOnInit(): void { 
this.http.get('https://jsonplaceholder.typicode.com/users/4').subscribe((data:any)=>{ 
console.log(data); 
this.user=data; 
}); 
} 
}