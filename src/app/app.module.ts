import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FileUploadModule} from 'primeng/fileupload';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {ListboxModule} from 'primeng/listbox';
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {MenubarModule} from "primeng/menubar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FileUploadModule,
    ListboxModule,
    FormsModule,
    TableModule,
    MenubarModule,
    BrowserAnimationsModule,
    CalendarModule,
    InputTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
