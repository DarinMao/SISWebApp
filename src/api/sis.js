const axios = require("axios");
const client = axios.create({
  baseURL: "https://sisstudent.fcps.edu/SVUE/Service/PXPCommunication.asmx"
})

const parse = require("xml-js");
const parseOpts = {
  compact: true,
  trim: true,
  alwaysArray: [
    "EmergencyContact",
    "UserDefinedItem",
    "UserDefinedGroupBox",
    "TermListing",
    "TermDefCode",
    "ClassListing",
    "DistrictEventRecord",
    "HealthVisitListing",
    "HealthConditionsListing",
    "HealthImmunizationListing",
    "ImmunizationDate",
    "ReportPeriod",
    "Course",
    "Mark",
    "Assignment",
    "EventList",
    "Absence",
    "Period",
    "PeriodTotal"
  ]
};

export default StudentVUE;

function StudentVUE(username, password) {
  this._username = username;
  this._password = password;
}

StudentVUE.prototype.request = async function(method, params={}) {
  const response = await client.post("/ProcessWebServiceRequest", {
    userID: this._username,
    password: this._password,
    skipLoginLog: true,
    parent: false,
    webServiceHandleName: "PXPWebServices",
    methodName: method,
    paramStr: parse.js2xml({Parms: params}, {compact: true})
  });
  const js = parse.xml2js(response.data.d, parseOpts);

  if (js.hasOwnProperty("RT_ERROR")) {
    throw new Error(js.RT_ERROR._attributes.ERROR_MESSAGE);
  }

  return js;
}

StudentVUE.prototype.testConnection = async function() {
  const data = await this.request("TestWebServiceURL");
  const js = data.TestWebServiceURL;

  return js.OrganizationName._text;
}

StudentVUE.prototype.authenticate = async function() {
  return this.request("GetPXPMessages");
}

StudentVUE.prototype.getDistrictName = async function() {
  const data = await this.request("ChildList");
  const js = data.ChildList;

  return js._attributes.DistrictName;
}

StudentVUE.prototype.getActiveModules = async function() {
  const data = await this.request("ChildList");
  const js = data.ChildList;

  const activeModules = js._attributes;
  const gradebook = activeModules.ShowGradeBookModule == "true";
  const attendance = activeModules.ShowAttendanceModule == "true";
  const schedule = activeModules.ShowCurrentScheduleModule == "true";
  const discipline = activeModules.ShowDisciplineModule == "true";
  const calendar = activeModules.ShowCalenderModule == "true";
  const conference = activeModules.ShowConferenceModule == "true";
  const courseHistory = activeModules.ShowCourseHistoryModule == "true";
  const courseRequest = activeModules.ShowCourseRequestModule == "true";
  const fees = activeModules.ShowFeeModule == "true";
  const healthVisits = activeModules.ShowHealthVisitModule == "true";
  const healthConditions = activeModules.ShowHealthConditionsModule == "true";
  const healthImmunizations = activeModules.ShowHealthImmunizationModule == "true";
  const healthInfo = healthVisits || healthConditions || healthImmunizations;
  const reportCard = activeModules.ShowReportCardModule == "true";
  const schoolInfo = activeModules.ShowSchoolInformationModule == "true";
  const streams = activeModules.ShowStreamsModule == "true";
  const classWebsite = activeModules.ShowClassWebSiteModule == "true";
  const namePronunciation = activeModules.ShowNamePronunciationModule == "true";
  const synergyMail = activeModules.ShowSynergyMailModule == "true";
  const documentModule = activeModules.ShowDocumentModule == "true";

  return {gradebook, attendance, schedule, discipline, calendar, conference, courseHistory, courseRequest, fees, healthInfo, healthVisits, healthConditions, healthImmunizations, reportCard, schoolInfo, streams, classWebsite, namePronunciation, synergyMail, documentModule};
}

StudentVUE.prototype.getDistrictEvents = async function() {
  const data = await this.request("ChildList");
  const js = data.ChildList;

  const districtEvents = [];
  const districtEventListAttributes = js.DistrictEventRecordList.DistrictEventRecord;
  if (districtEventListAttributes != undefined) {
    for (let i = 0; i < districtEventListAttributes.length; i++) {
      const districtEventAttributes = districtEventListAttributes[i]._attributes;
      const date = new Date(districtEventAttributes.EventDate + " " + districtEventAttributes.EventTime);
      const title = districtEventAttributes.ShortTitle;
      const shortDesc = districtEventAttributes.ShortDesc;
      const longDesc = districtEventAttributes.LongDesc;
      districtEvents.push({date, title, shortDesc, longDesc});
    }
  }

  return districtEvents;
}

StudentVUE.prototype.getStudent = async function() {
  const data = await this.request("StudentInfo");
  const js = data.StudentInfo;

  const name = js.FormattedName._text;
  const id = parseInt(js.PermID._text);
  const gender = js.Gender._text;
  const grade = parseInt(js.Grade._text);
  const address = js.Address._text;
  const lastNameGoesBy = js.LastNameGoesBy._text;
  const nickname = js.NickName._text;
  const birthdate = new Date(js.BirthDate._text);
  const email = js.EMail._text;
  const phone = js.Phone._text;
  const homeLanguage = js.HomeLanguage._text;
  const school = js.CurrentSchool._text;
  const track = js.Track._text;
  const photo = js.Photo._text;
  const emergencyContacts = [];
  const emergencyContactListAttributes = js.EmergencyContacts.EmergencyContact;
  if (emergencyContactListAttributes != undefined) {
    for (let i = 0; i < emergencyContactListAttributes.length; i++) {
      const emergencyContactAttributes = emergencyContactListAttributes[i]._attributes;
      emergencyContacts.push({
        name: emergencyContactAttributes.Name,
        relationship: emergencyContactAttributes.Relationship,
        homePhone: emergencyContactAttributes.HomePhone,
        workPhone: emergencyContactAttributes.WorkPhone,
        otherPhone: emergencyContactAttributes.OtherPhone
      });
    }
  }
  const physicianAttributes = js.Physician._attributes;
  const physician = {
    name: physicianAttributes.Name,
    hospital: physicianAttributes.Hospital,
    phone: physicianAttributes.Phone,
    extension: physicianAttributes.Extn
  }
  const dentistAttributes = js.Dentist._attributes;
  const dentist = {
    name: dentistAttributes.Name,
    office: dentistAttributes.Office,
    phone: dentistAttributes.Phone,
    extension: dentistAttributes.Extn
  }
  const customItemGroups = {};
  const customItemGroupListAttributes = js.UserDefinedGroupBoxes.UserDefinedGroupBox;
  if (customItemGroupListAttributes != undefined) {
    for (let i = 0; i < customItemGroupListAttributes.length; i++) {
      const customItems = {}
      const customItemListAttributes = customItemGroupListAttributes[i].UserDefinedItems.UserDefinedItem;
      if (customItemListAttributes != undefined) {
        for (let j = 0; j < customItemListAttributes.length; j++) {
          const customItemAttributes = customItemListAttributes[j]._attributes;
          customItems[customItemAttributes.ItemLabel] = customItemAttributes.Value;
        }
      }
      const label = customItemGroupListAttributes[i]._attributes.GroupBoxLabel;
      customItemGroups[label] = customItems;
    }
  }

  return {name, id, gender, grade, address, lastNameGoesBy, nickname, birthdate, email, phone, homeLanguage, school, track, photo, emergencyContacts, physician, dentist, customItemGroups}
}

StudentVUE.prototype.getTermList = async function() {
  const data = await this.request("StudentClassList");
  const js = data.StudentClassSchedule;

  const termList = [];
  const termListAttributes = js.TermLists.TermListing;
  if (termListAttributes != undefined) {
    for (let i = 0; i < termListAttributes.length; i++) {
      const termAttributes = termListAttributes[i]._attributes;
      const termIndex = parseInt(termAttributes.TermIndex);
      const termName = termAttributes.TermName;
      const termBegin = new Date(termAttributes.BeginDate);
      const termEnd = new Date(termAttributes.EndDate);
      const termCodes = [];
      const termCodeListAttributes = termListAttributes[i].TermDefCodes.TermDefCode;
      if (termCodeListAttributes != undefined) {
        for (let j = 0; j < termCodeListAttributes.length; j++) {
          termCodes.push(termCodeListAttributes[j]._attributes.TermDefName);
        }
      }
      termList.push({
        index: termIndex,
        name: termName,
        beginDate: termBegin,
        endDate: termEnd,
        termCodes: termCodes
      });
    }
  }

  return termList;
}

StudentVUE.prototype.getClassSchedule = async function(term) {
  const params = {};
  if (term != undefined) {
    params.TermIndex = term;
  }
  const data = await this.request("StudentClassList", params);
  const js = data.StudentClassSchedule;

  const classScheduleAttributes = js._attributes;
  const termIndex = parseInt(classScheduleAttributes.TermIndex);
  const termName = classScheduleAttributes.TermIndexName;

  const classList = [];
  const classListAttributes = js.ClassLists.ClassListing;
  if (classListAttributes != undefined) {
    for (let i = 0; i < classListAttributes.length; i++) {
      const classAttributes = classListAttributes[i]._attributes;
      const classPeriod = parseInt(classAttributes.Period);
      const className = classAttributes.CourseTitle;
      const classRoom = classAttributes.RoomName;
      const classTeacherName = classAttributes.Teacher;
      const classTeacherEmail = classAttributes.TeacherEmail;
      const classTeacher = {
        name: classTeacherName,
        email: classTeacherEmail
      };
      classList.push({
        period: classPeriod,
        name: className,
        room: classRoom,
        teacher: classTeacher
      });
    }
  }

  return {termIndex, termName, classList};
}

/* Gradebook is still closed :(
StudentVUE.prototype.getGrades = async function(term=null) {
  const params = {ChildIntID: 0};
  if (term != null) {
    params.ReportPeriod = term;
  }
  const data = await this.request("Gradebook", params);
  const js = data.StudentClassSchedule;
}
*/

StudentVUE.prototype.getGrades = async function(term=null) {
  const params = {};
  if (term != null) {
    params.ReportPeriod = term;
  }
  const data = await this.request("Gradebook", params);
  const js = data.Gradebook;

  const reportPeriods = [];
  const reportPeriodListAttributes = js.ReportingPeriods.ReportPeriod;
  if (reportPeriodListAttributes != undefined) {
    for (let i = 0; i < reportPeriodListAttributes.length; i++) {
      const reportPeriodAttributes = reportPeriodListAttributes[i]._attributes;
      const index = parseInt(reportPeriodAttributes.Index);
      const name = reportPeriodAttributes.GradePeriod;
      const beginDate = new Date(reportPeriodAttributes.StartDate);
      const endDate = new Date(reportPeriodAttributes.EndDate);
      reportPeriods.push({index, name, beginDate, endDate});
    }
  }

  const reportPeriodAttributes = js.ReportingPeriod._attributes;
  const name = reportPeriodAttributes.GradePeriod;
  const beginDate = new Date(reportPeriodAttributes.StartDate);
  const endDate = new Date(reportPeriodAttributes.EndDate);
  const reportPeriod = {name, beginDate, endDate};

  const courses = [];
  const courseListAttributes = js.Courses.Course;
  if (courseListAttributes != undefined) {
    for (let i = 0; i < courseListAttributes.length; i++) {
      const courseAttributes = courseListAttributes[i]._attributes;
      const period = parseInt(courseAttributes.Period);
      const name = courseAttributes.Title;
      const room = courseAttributes.Room;
      const teacherName = courseAttributes.Staff;
      const teacherEmail = courseAttributes.StaffEMail;
      const teacher = {
        name: teacherName,
        email: teacherEmail
      };

      const marks = [];
      const markListAttributes = courseListAttributes[i].Marks.Mark;
      if (markListAttributes != undefined) {
        for (let j = 0; j < markListAttributes.length; j++) {
          const markAttributes = markListAttributes[j]._attributes;
          const name = markAttributes.MarkName;
          const calculatedScore = markAttributes.CalculatedScoreString;
          const rawCalculatedScore = parseFloat(markAttributes.CalculatedScoreRaw);

          const gradeSummary = [];
          const gradeSummaryListAttributes = markListAttributes[j].GradeCalculationSummary.AssignmentGradeCalc;
          if (gradeSummaryListAttributes != undefined) {
            for (let k = 0; k < gradeSummaryListAttributes.length; k++) {
              const gradeSummaryAttributes = gradeSummaryListAttributes[k]._attributes;
              const type = gradeSummaryAttributes.Type;
              const weightPercent = parseFloat(gradeSummaryAttributes.Weight);
              const points = parseFloat(gradeSummaryAttributes.Points);
              const pointsPossible = parseFloat(gradeSummaryAttributes.PointsPossible);
              const weightedPercent = parseFloat(gradeSummaryAttributes.WeightedPct);
              const calculatedMark = gradeSummaryAttributes.CalculatedMark;
              gradeSummary.push({type, weightPercent, points, pointsPossible, weightedPercent, calculatedMark});
            }
          }

          const assignments = {};
          const assignmentListAttributes = markListAttributes[j].Assignments.Assignment;
          if (assignmentListAttributes != undefined) {
            for (let k = 0; k < assignmentListAttributes.length; k++) {
              const assignmentAttributes = assignmentListAttributes[k]._attributes;
              const id = parseInt(assignmentAttributes.GradebookID);
              const name = assignmentAttributes.Measure;
              const type = assignmentAttributes.Type;
              const date = new Date(assignmentAttributes.Date);
              const dueDate = new Date(assignmentAttributes.DueDate);
              const score = assignmentAttributes.Score;
              const scoreType = assignmentAttributes.ScoreType;
              const points = assignmentAttributes.Points;
              const notes = assignmentAttributes.Notes;
              assignments[id] = {name, type, date, dueDate, score, scoreType, points, notes};
            }
          }
          marks.push({name, calculatedScore, rawCalculatedScore, gradeSummary, assignments});
        }
      }
      courses.push({period, name, room, teacher, marks});
    }
  }
  return {reportPeriods, reportPeriod, courses};
}

StudentVUE.prototype.getHealthInfo = async function(healthModules={}) {
  const params = {};
  if (!healthModules.hasOwnProperty("healthVisits") || !healthModules.hasOwnProperty("healthConditions") || !healthModules.hasOwnProperty("healthImmunizations")) {
    healthModules = await this.getActiveModules();
  }
  params.HealthVisits = healthModules.healthVisits;
  params.HealthConditions = healthModules.healthConditions;
  params.HealthImmunizations = healthModules.healthImmunizations;
  const data = await this.request("StudentHealthInfo", params);
  const js = data.StudentHealthData;

  const healthVisits = [];
  // const healthVisitListAttributes = js.HealthVisitListings.HealthVisitListing;
  // if (healthVisitListAttributes != undefined) {
  //   for (let i = 0; i < healthVisitListAttributes.length; i++) {
  //     const healthVisitAttributes = healthVisitListAttributes[i];
  //     // no health visits in fcps so can't write this part
  //   }
  // }
  const healthConditions = [];
  const healthConditionsListAttributes = js.HealthConditionsListings.HealthConditionsListing;
  if (healthConditionsListAttributes != undefined) {
    for (let i = 0; i < healthConditionsListAttributes.length; i++) {
      const healthConditionAttributes = healthConditionsListAttributes[i]._attributes;
      const startDate = new Date(healthConditionAttributes.StartDate);
      const endDate = new Date(healthConditionAttributes.EndDate);
      const condition = healthConditionAttributes.ConditionCode;
      const comment = healthConditionAttributes.Comment;
      healthConditions.push({startDate, endDate, condition, comment});
    }
  }
  const healthImmunizations = [];
  const healthImmunizationListAttributes = js.HealthImmunizationListings.HealthImmunizationListing;
  if (healthImmunizationListAttributes != undefined) {
    for (let i = 0; i < healthImmunizationListAttributes.length; i++) {
      const healthImmunizationAttributes = healthImmunizationListAttributes[i]._attributes;
      const compliant = healthImmunizationAttributes.Compliant == "true";
      const complianceMessage = healthImmunizationAttributes.CompliantMessage;
      const name = healthImmunizationAttributes.Name;
      const doses = parseInt(healthImmunizationAttributes.NumReqDoses);
      const immunizationDates = [];
      const healthImmunizationDates = healthImmunizationListAttributes[i].ImmunizationDatesData.ImmunizationDate;
      if (healthImmunizationDates != undefined) {
        for (let j = 0; j < healthImmunizationDates.length; j++) {
          immunizationDates.push(new Date(healthImmunizationDates[j]._attributes.ImmunizationDt));
        }
      }
      healthImmunizations.push({compliant, complianceMessage, name, doses, immunizationDates});
    }
  }

  return {healthVisits, healthConditions, healthImmunizations};
}

StudentVUE.prototype.getCalendar = async function(date=new Date()) {
  const dateString = (date instanceof Date)?`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`:date;
  const data = await this.request("StudentCalendar", {RequestDate: dateString});
  const js = data.CalendarListing;

  const calendarAttributes = js._attributes;
  const schoolStart = new Date(calendarAttributes.SchoolBegDate);
  const schoolEnd = new Date(calendarAttributes.SchoolEndDate);
  const monthStart = new Date(calendarAttributes.MonthBegDate);
  const monthEnd = new Date(calendarAttributes.MonthEndDate);

  const events = [];
  const eventListAttributes = js.EventLists.EventList;
  if (eventListAttributes != undefined) {
    for (let i = 0; i < eventListAttributes.length; i++) {
      const eventAttributes = eventListAttributes[i]._attributes;
      const date = new Date(`${eventAttributes.Date} ${(eventAttributes.StartTime == "All Day")?"":eventAttributes.StartTime}`);
      const title = eventAttributes.Title;
      const dayType = eventAttributes.DayType;
      const description = (eventAttributes.hasOwnProperty("EvtDescription"))?eventAttributes.EvtDescription:"";
      events.push({date, title, dayType, description});
    }
  }

  return {schoolStart, schoolEnd, monthStart, monthEnd, events};
}

StudentVUE.prototype.getAttendance = async function() {
  const data = await this.request("Attendance");
  const js = data.Attendance;

  const attendanceAttributes = js._attributes;
  const type = attendanceAttributes.Type;
  const start = parseInt(attendanceAttributes.StartPeriod);
  const end = parseInt(attendanceAttributes.EndPeriod);
  const periods = parseInt(attendanceAttributes.PeriodCount);

  const absences = [];
  const absenceListAttributes = js.Absences.Absence;
  if (absenceListAttributes != undefined) {
    for (let i = 0; i < absenceListAttributes.length; i++) {
      const absenceAttributes = absenceListAttributes[i]._attributes;
      const date = new Date(absenceAttributes.AbsenceDate);
      const reason = absenceAttributes.Reason;
      const note = absenceAttributes.Note;

      const periods = [];
      const periodListAttributes = absenceListAttributes[i].Periods.Period;
      if (periodListAttributes != undefined) {
        for (let k = 0; k < periodListAttributes.length; k++) {
          const periodAttributes = periodListAttributes[k]._attributes;
          const period = parseInt(periodAttributes.Number);
          const name = periodAttributes.Name;
          const reason = periodAttributes.Reason;
          const teacherName = periodAttributes.Staff;
          const teacherEmail = periodAttributes.StaffEMail;
          const teacher = {
            name: teacherName,
            email: teacherEmail
          };
          const school = periodAttributes.SchoolName;
          periods.push({period, name, reason, teacher, school});
        }
      }

      absences.push({date, reason, note, periods});
    }
  }

  const excused = {};
  const excusedListAttributes = js.TotalExcused.PeriodTotal;
  if (excusedListAttributes != undefined) {
    for (let i = 0; i < excusedListAttributes.length; i++) {
      const excusedAttributes = excusedListAttributes[i]._attributes;
      const period = parseInt(excusedAttributes.Number);
      const total = parseInt(excusedAttributes.Total);
      excused[period] = total;
    }
  }

  const tardies = {};
  const tardiesListAttributes = js.TotalTardies.PeriodTotal;
  if (tardiesListAttributes != undefined) {
    for (let i = 0; i < tardiesListAttributes.length; i++) {
      const tardiesAttributes = tardiesListAttributes[i]._attributes;
      const period = parseInt(tardiesAttributes.Number);
      const total = parseInt(tardiesAttributes.Total);
      tardies[period] = total;
    }
  }

  const unexcused = {};
  const unexcusedListAttributes = js.TotalUnexcused.PeriodTotal;
  if (unexcusedListAttributes != undefined) {
    for (let i = 0; i < unexcusedListAttributes.length; i++) {
      const unexcusedAttributes = unexcusedListAttributes[i]._attributes;
      const period = parseInt(unexcusedAttributes.Number);
      const total = parseInt(unexcusedAttributes.Total);
      unexcused[period] = total;
    }
  }

  const activities = {};
  const activitiesListAttributes = js.TotalActivities.PeriodTotal;
  if (activitiesListAttributes != undefined) {
    for (let i = 0; i < activitiesListAttributes.length; i++) {
      const activitiesAttributes = activitiesListAttributes[i]._attributes;
      const period = parseInt(activitiesAttributes.Number);
      const total = parseInt(activitiesAttributes.Total);
      activities[period] = total;
    }
  }

  const unexcusedTardies = {};
  const unexcusedTardiesListAttributes = js.TotalActivities.PeriodTotal;
  if (unexcusedTardiesListAttributes != undefined) {
    for (let i = 0; i < unexcusedTardiesListAttributes.length; i++) {
      const unexcusedTardiesAttributes = unexcusedTardiesListAttributes[i]._attributes;
      const period = parseInt(unexcusedTardiesAttributes.Number);
      const total = parseInt(unexcusedTardiesAttributes.Total);
      unexcusedTardies[period] = total;
    }
  }

  return {absences, excused, tardies, unexcused, activities, unexcusedTardies};
}
