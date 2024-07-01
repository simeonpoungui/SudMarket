import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, ViewChild } from '@angular/core';
import { NotificationsService } from 'src/app/Services/notifications.service';
import { GetNotification } from 'src/app/Models/notifications.stock.produit.model';
import { GlobalService } from 'src/app/Services/global.service';

@Component({
  selector: 'app-notifications-stock-produits',
  templateUrl: './notifications-stock-produits.component.html',
  styleUrls: ['./notifications-stock-produits.component.scss']
})
export class NotificationsStockProduitsComponent {
  dataSource!: any
  isloadingpage!: boolean
  displayedColumns = [
    'produit_id',
    'message',
    'date_notification',
    'est_lu'
  ];
  constructor(
    private notificationServicve: NotificationsService,
    public globalService: GlobalService,
    private dialog: MatDialog
  ){}

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    this.getListNotifications()
  }
  getListNotifications(){
    this.isloadingpage = true
    const notif: GetNotification = {
      notification_id: 0,
    }
    this.notificationServicve.getListNotifications(notif).subscribe(data => {
      console.log(data);
      this.isloadingpage = false
      this.dataSource = new MatTableDataSource(data.message);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(filterValue: any) {
    const value = filterValue.target.value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
