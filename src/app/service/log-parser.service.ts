import { Injectable } from '@angular/core';
import {ChatChannelType, LogEntry} from "../model/model";
import {DateTime} from "luxon";

const DM_REGEX = /.+PippiChat: (.*) said in channel \[(.*?):(.*?)]: (.+)/
const CLAN_REGEX = /.+PippiChat: (.*) said in channel \[(.*?)]: (.+)/
const LOCAL_REGEX = /.+PippiChat: (.*) said in channel \[Local]: (.+)/
const GLOBAL_REGEX = /.+PippiChat: (.*) said in channel \[Global]: (.+)/
const DATE_REGEX = /\[(.*?)]\[Pippi]PippiChat:/

@Injectable({
  providedIn: 'root'
})
export class LogParserService {

  constructor() { }

  public parseLog(logFileText: string): LogEntry[] {
    return logFileText.split("\n")
      .map(value => LogParserService.parseLine(value))
      .filter(value => value !== null)
      .map(value => value as LogEntry);
  }


  private static parseLine(line: string): LogEntry | null {
    const parsed = LogParserService.parsePippiLineType(line)
    const parsedDate = LogParserService.parseDate(line);
    if (parsedDate == null) {
      return null;
    }
    return {
      msg: line,
      type: parsed.type,
      chatChannel: parsed.chatChannel,
      sendingPlayer: parsed.sendingPlayer,
      chatMessage: parsed.chatMessage,
      timestamp: parsedDate,
    }
  }

  private static isPippiLogLine(line: string): boolean {
    return line.includes('[Pippi]');
  }

  private static parseDate(line: string): Date | null {
    const match = DATE_REGEX.exec(line);
    if (match != null) {
      // Example: 2022.02.23-08.14.47:741
      // This is: yyyy.MM.dd-hh.mm.ss:SSS
      const dateString = match[1];
      return DateTime.fromFormat(dateString, "yyyy.MM.dd-HH.mm.ss:SSS").toJSDate();
    }
    return null;
  }

  // 'DM' | 'Local' | 'Clan' | 'none'
  private static parsePippiLineType(line: string): {
    type: ChatChannelType,
    chatChannel: string,
    sendingPlayer: string,
    chatMessage: string,
  } {
    if (!LogParserService.isPippiLogLine(line)) {
      return {
        type: 'none',
        chatChannel: '',
        sendingPlayer: '',
        chatMessage: '',
      }
    }
    // See if it's local
    let localMatch = LOCAL_REGEX.exec(line);
    if (localMatch != null) {
      return {
        type: 'Local',
        chatChannel: 'Local',
        sendingPlayer: localMatch[1],
        chatMessage: localMatch[2],
      }
    }
    let globalMatch = GLOBAL_REGEX.exec(line);
    if (globalMatch != null) {
      return {
        type: 'Global',
        chatChannel: 'Global',
        sendingPlayer: globalMatch[1],
        chatMessage: globalMatch[2],
      }
    }
    const dmMatch = DM_REGEX.exec(line);
    if (dmMatch != null) {
      return {
        type: 'DM',
        sendingPlayer: dmMatch[1],
        chatChannel: `${dmMatch[2]}:${dmMatch[3]}`,
        chatMessage: dmMatch[4],
      }
    }
    const clanMatch = CLAN_REGEX.exec(line);
    if (clanMatch != null) {
      return {
        type: "Clan",
        sendingPlayer: clanMatch[1],
        chatChannel: clanMatch[2],
        chatMessage: clanMatch[3],
      }
    }
    return {
      type: 'none',
      chatChannel: '',
      sendingPlayer: '',
      chatMessage: '',
    }
  }
}
