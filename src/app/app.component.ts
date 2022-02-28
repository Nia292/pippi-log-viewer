import {Component, ViewChild} from '@angular/core';
import {from} from "rxjs";
import {LogParserService} from "./service/log-parser.service";
import {ChatChannelType, LogEntry} from "./model/model";
import {SelectItemGroup} from "primeng/api";
import {SelectItem} from "primeng/api/selectitem";
import {FileUpload} from "primeng/fileupload";
import {Table} from "primeng/table";

function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}


interface AvailableChatItem {
  name: string;
  type: ChatChannelType;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pippi-log-viewer';

  parsing = false;
  logEntries: LogEntry[] = [];

  selectedEntries: LogEntry[] = [];

  groupedAvailableItems: SelectItemGroup[] = [];

  @ViewChild(FileUpload)
  fileUpload?: FileUpload;
  selectedEntry?: AvailableChatItem;
  globalFilterFields = ['chatMessage', 'sendingPlayer'];

  constructor(private logParser: LogParserService) {
  }

  myUploader(event: { files: File[] }): void {
    if (event.files.length === 1) {
      const file = event.files[0];
      from(file.text())
        .subscribe(logFileText => this.handleLogFileTextRead(logFileText));
    } else {
      throw new Error('Expected exactly one file!');
    }
  }

  private handleLogFileTextRead(text: string): void {
    this.logEntries = this.logParser.parseLog(text);
    this.parsing = false;
    const availableClanChats: SelectItem<AvailableChatItem>[] = this.logEntries
      .filter(value => value.type === 'Clan')
      .map(value => value.chatChannel)
      .filter(onlyUnique)
      .map(name => ({label: name, value: {name: name, type: 'Clan'}}));

    const availableDMChats: SelectItem<AvailableChatItem>[] = this.logEntries
      .filter(value => value.type === 'DM')
      .map(value => value.chatChannel)
      .filter(onlyUnique)
      .map(name => ({label: name, value: {name: name, type: 'Clan'}}));


    this.groupedAvailableItems = [
      {
        label: 'Available Public Chats',
        items: [
          {
            label: 'Global',
            value: {name: 'Global', type: 'Global'}
          },
          {
            label: 'Local',
            value: {name: 'Local', type: 'Local'}
          }
        ]
      },
      {
        label: 'Available Clan Chats',
        items: availableClanChats
      },
      {
        label: 'Available DM Chats',
        items: availableDMChats
      }
    ]
    this.fileUpload?.clear();
  }

  setSelectedChat(item: AvailableChatItem): void {
    this.selectedEntries = this.logEntries.filter(value => value.chatChannel === item.name);
  }

  getAvailableHeight(): string {
    return (window.innerHeight - 200) + 'px';
  }

  filterGlobal(dt: Table, event: any): void {
    dt.filterGlobal(event?.target?.value, 'contains')
  }
}
