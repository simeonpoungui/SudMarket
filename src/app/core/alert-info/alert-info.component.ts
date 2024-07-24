import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert-info',
  templateUrl: './alert-info.component.html',
  styleUrls: ['./alert-info.component.scss']
})
export class AlertInfoComponent {
  @Input() title: string = "Alerte !"
  @Input() content!: string;
  type!: "danger" | "info" | "success";
  @Input() buttonOKName: string = "OK";
  @Input() buttonCancelName: string = "Annuler";
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
