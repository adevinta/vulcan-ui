import { Finding } from "@/services/vulcan-api";

/*
Copyright 2021 Adevinta
*/

export function severityStyle(score: number) {
    let severityClass = "";
  
    if (score == 0) {
      severityClass = "is-info-severity";
    } else if (score > 0 && score < 4) {
      severityClass = "is-low-severity";
    } else if (score >= 4 && score < 7) {
      severityClass = "is-medium-severity";
    } else if (score >= 7 && score < 9) {
      severityClass = "is-high-severity";
    } else {
      severityClass = "is-critical-severity";
    }
  
    return "tag " + severityClass;
  }
  
  export function severityText(score: number) {
    let severityText = "";
  
    if (score == 0) {
      severityText = "Info";
    } else if (score > 0 && score < 4) {
      severityText = "Low";
    } else if (score >= 4 && score < 7) {
      severityText = "Medium";
    } else if (score >= 7 && score < 9) {
      severityText = "High";
    } else {
      severityText = "Critical";
    }
  
    return severityText;
  }
  
  export function statusClass(status: string) {
    let statusClass = "";
  
    if (status == "OPEN") {
      statusClass = "is-live-report-status-open";
    } else if (status == "FIXED") {
      statusClass = "is-live-report-status-fixed";
    } else if (status == "FALSE_POSITIVE") {
        statusClass = "is-live-report-status-false-positive";
    } else {
      statusClass = "is-live-report-status-default";
    }
  
    return " " + statusClass;
  }
  
  export function urlDomain(url) {
    try {
      return (new URL(url)).hostname;
    }
    catch {
      return ""
    }

  }

  export class propsFindingDetailTemplate {
      row: Finding = {}
  }
