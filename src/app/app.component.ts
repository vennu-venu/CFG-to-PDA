import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CFG to PDA';
  isClicked:boolean = false;
  isSubmitted : boolean = false;
  text : string = "";
  productions !: any[];
  finalProductionsLeft : string[] = [];
  finalProductionsRight : string[] = [];
  currPDA : string[] = ["q0"];
  nextPDA : string[] = ["q1"];
  ipPDA : string[] = ["$"];
  topPDA : string[] = ["Z0"];
  stkPDA : string[] = ["S"];
  terminals : string[] = [];
  variables : string[] = [];
  finalTerminals : any;
  finalVariables : any;
  finalProductions : string[] = [];
  result : string[] = [];

  formTemplate = new FormGroup({
    grammar : new FormControl('', Validators.required)
  })

  get formControls() {
    return this.formTemplate['controls'];
  }

  switch() {
    this.isClicked = !this.isClicked;
  }

  onSubmit(x:any) {
    this.isSubmitted = true;
    this.text = this.formTemplate.value.grammar;
    this.productions = this.text.split("\n").filter((prod)=>prod.length>0).map((prod)=>prod.split(" ").join(""));
    for(let i of this.productions) {
      let left, right;
      [left, right] = i.split("->");
      right = right.split("|");
      for(let j of right) {
        this.finalProductionsLeft.push(left);
        this.finalProductionsRight.push(j);
        this.finalProductions.push(left+" -> "+j);
      }
    }
    for(let i of this.finalProductionsRight) {
      for(let j of i) {
        if(j!=j.toUpperCase()) {
          this.terminals.push(j);
        }
        else {
          this.variables.push(j);
        }
      }
    }
    for(let i of this.finalProductionsLeft) {
      for(let j of i) {
        if(j==j.toUpperCase()) {
          this.variables.push(j);
        }
      }
    }
    this.finalTerminals = new Set(this.terminals);
    this.finalVariables = new Set(this.variables);
    for(let i in this.finalProductionsLeft) {
      this.currPDA.push("q1");
      this.ipPDA.push("$");
      this.topPDA.push(this.finalProductionsLeft[i]);
      this.nextPDA.push("q1");
      this.stkPDA.push(this.finalProductionsRight[i]);
    }
    for(let i of this.finalTerminals) {
      this.currPDA.push("q1");
      this.ipPDA.push(i);
      this.topPDA.push(i);
      this.nextPDA.push("q1");
      this.stkPDA.push("$");
    }
    this.currPDA.push("q1");
    this.ipPDA.push("$");
    this.topPDA.push("Z0");
    this.nextPDA.push("qf");
    this.stkPDA.push("Z0");
    for(let i in this.currPDA) {
      this.result.push("( "+this.currPDA[i]+", "+this.ipPDA[i]+", "+this.topPDA[i]+" ) = ( "+this.nextPDA[i]+", "+this.stkPDA[i]+" )");
    }
  }
}
