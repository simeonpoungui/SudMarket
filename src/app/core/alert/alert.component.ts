import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {

  @Input() title: string = "Alerte !"
  @Input() content!: string;
  type!: "danger" | "info" | "success";
  @Input() buttonOKName: string = "Oui";
  @Input() buttonCancelName: string = "Non";
  styleAlert!: Object;
  @Input() backgroundColor!: string
  @Input() textColor!: string
  ngOnInit(): void {
    if(!this.backgroundColor){
      this.styleAlert = {
        'Message--green': this.type == "success",
        'Message--red': this.type == "danger",
        'Message': this.type == "info",
        'Message--orange': !this.type,
      }
    }
  }
}
