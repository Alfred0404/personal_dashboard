// ==UserScript==
// @name         Extract Grades With JSON format [ECE Paris]
// @namespace    ECE Paris Script
// @version      0.1
// @description  Allows you to calculate course averages automatically and add the average box to the grades table.
// @author       BragdonD
// @match        https://campusonline.inseec.net/note/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// ==/UserScript==

/**
 * @typedef {Object} Grade
 * @property {number} value
 * @property {number} weight
 */

/**
 * @typedef {Object} CourseGradePart
 * @property {number} weight
 * @property {Array.<Grades>} grades
 */

/**
 * @typedef {CourseGradePart} Continuous
 */

/**
 * @typedef {CourseGradePart} Exams
 */

/**
 * @typedef {CourseGradeParts} Projects
 */

/**
 * @typedef {CourseGradeParts} Resit
 */

/**
 * @typedef {Object} Course
 * @property {string} name
 * @property {Continuous} continuous
 * @property {Exams} exams
 * @property {Projects} projects
 * @property {number} coefficient // ECTS
 * @property {Resit} resit
 */

/**
 * @typedef {Object} Module
 * @property {string} name
 * @property {Array.<Course>} courses
 */

/**
 * @typedef {Object} Semester
 * @property {string} name
 * @property {Array.<Module>} modules
 * @note All semester count the same in the year average
 */

/**
 * @typedef {Object} Year
 * @property {string} name
 * @property {Array.<Semester>} semesters
 */

var $ = window.jQuery;

var nbYears = -1;
var nbSemesters = -1;
var nbModules = -1;
var nbSubject = -1;

/** It is the variable that will store the parsing of the table. It will acts as a result of the database. **/
var years = [];
var semesters = [];
var modules = [];
var subjects = [];

const yearIdentificationStr = "Année";
const semestreIdentificationStr = "Semestre";
const moduleIdentificationStr = "Module";

const gradeRegex =
  /([0-9]{1,2},[0-9]{1,2}) (?:\([0-9]{1,2}(?:\.[0-9]{1,2})?\%\))?/g;
const parseGradeRegex =
  /([0-9]{1,2},[0-9]{1,2})|(?:[0-9]{1,2}(?:.[0-9]{1,2})?)?/g;

function createYear(number, $parent) {
  years.push({ year: number, row: $parent, coeff: 1, average: 0 });
  nbYears += 1;
}

function createSemester(number, $parent) {
  semesters.push({
    number: number,
    nbYears: nbYears,
    row: $parent,
    coeff: 1,
    average: 0,
  });
  nbSemesters += 1;
}

function createModule(name, $parent) {
  modules.push({
    name: name,
    semestreId: nbSemesters,
    subject: [],
    row: $parent,
    coeff: 0,
    average: 0,
  });
  nbModules += 1;
}

function CreateNewSubject(name, $parent) {
  subjects.push({ sub: name, grades: {}, moduleId: nbModules, row: $parent });
  nbSubject += 1;
}

function parseSubject($children, $parent) {
  let subjectName = $children[0].textContent;
  CreateNewSubject(subjectName, $parent);
  if ($children[1].classList.contains("ponderation")) {
    let subjectCoeff = $children[1].textContent;
    subjects[nbSubject].coeff = subjectCoeff;
  }
}

function parseGrade(gradeStrArr) {
  let grades = [];
  for (let i = 0; i < gradeStrArr?.length; i++) {
    let parseResult = gradeStrArr[i].match(parseGradeRegex);
    parseResult = parseResult.filter((str) => str !== "");
    grades.push({
      grade: parseResult[0],
      coeff: parseResult[1] !== undefined ? parseResult[1] : 100,
    });
  }
  return grades;
}

function parseGrades($children, $parent) {
  const continu = "continu";
  const exam = "examen";
  const project = "project";

  let subjectPartName = $children[0].textContent;
  let subjectPartCoeff = $children[2].textContent;
  let subjectPartGrades = $children[3].textContent;

  let nameToInsert = subjectPartName.toLowerCase().includes(continu)
    ? continu
    : subjectPartName.toLowerCase().includes(exam)
      ? exam
      : project;

  subjects[nbSubject]["grades"][nameToInsert] = {
    grades: parseGrade(subjectPartGrades.match(gradeRegex)),
    coeff: subjectPartCoeff,
    row: $parent,
  };
}

function parseRow($row, index) {
  let $children = $row.querySelectorAll("td");
  if ($children[0].classList.contains("item-ens")) {
    if (
      $children[0].textContent.includes(yearIdentificationStr) ||
      $children[0].textContent.includes("ING")
    ) {
      createYear(nbYears + 2, $row);
    } else if ($children[0].textContent.includes(semestreIdentificationStr)) {
      createSemester(nbSemesters + 2, $row);
    } else if (
      $children[0].textContent.includes(moduleIdentificationStr) ||
      $children[0].textContent.includes("MODULE")
    ) {
      createModule($children[0].textContent, $row);
    }
  }
  if ($children[0].classList.contains("item-fpc")) {
    parseSubject($children, $row);
  }
  if ($children[0].classList.contains("item-ev1")) {
    parseGrades($children, $row);
  }
}

function parseTable($table) {
  var $rows = $table.find("tr");
  $rows.each((index, item) => {
    if (item.classList.contains("slave") || item.classList.contains("master")) {
      parseRow(item, index);
    }
  });
}

function equalizeGradesType(type) {
  if (type === undefined) return;
  let totalCoeff = 0;
  type.grades.forEach((item) => {
    totalCoeff += parseFloat(item.coeff);
  });
  type.grades.forEach((item) => {
    item.grade = parseFloat(item.grade.replace(/,/, "."));
    item.coeff = item.coeff / totalCoeff;
  });
}

function equalizeGrades() {
  subjects.forEach((item) => {
    equalizeGradesType(item.grades.continu);
    equalizeGradesType(item.grades.examen);
    equalizeGradesType(item.grades.project);
  });
}

function calculateGradesAverage(type) {
  if (type === undefined) return;
  if (type.grades.length === 0) type.average = undefined;
  let average = 0;
  type.grades.forEach((item) => {
    average += item.grade * item.coeff;
  });
  type.average = parseFloat(average);
}

function calculateEachGradesAverage() {
  subjects.forEach((item) => {
    calculateGradesAverage(item.grades.continu);
    calculateGradesAverage(item.grades.examen);
    calculateGradesAverage(item.grades.project);
  });
}

function transformToFloatCoeffForEachSubject() {
  let modifyCoeff = (type) => {
    if (type === undefined) return;
    type.coeff = type.coeff?.match(parseGradeRegex);
    type.coeff = type.coeff?.filter((str) => str !== "")[0];
    type.coeff = parseFloat(type.coeff);
  };
  subjects.forEach((item) => {
    modifyCoeff(item.grades.continu);
    modifyCoeff(item.grades.examen);
    modifyCoeff(item.grades.project);
  });
}

function equalizeSubjectCoeff(subject) {
  let coeff = [];
  let continu = false;
  let exam = false;
  let project = false;
  if (subject.continu !== undefined) {
    if (subject.continu?.grades.length > 0) {
      coeff.push(subject.continu?.coeff);
      continu = true;
    }
  }
  if (subject.examen !== undefined) {
    if (subject.examen?.grades.length > 0) {
      coeff.push(subject.examen?.coeff);
      exam = true;
    }
  }
  if (subject.project !== undefined) {
    if (subject.project?.grades.length > 0) {
      coeff.push(subject.project?.coeff);
      project = true;
    }
  }
  if (coeff.length > 0) {
    let finalCoeff = coeff.reduce((i, n) => {
      return i + n;
    });
    if (subject.continu !== undefined) {
      subject.continu.coeff = subject.continu.coeff / finalCoeff;
    }
    if (subject.examen !== undefined) {
      subject.examen.coeff = subject.examen.coeff / finalCoeff;
    }
    if (subject.project !== undefined) {
      subject.project.coeff = subject.project.coeff / finalCoeff;
    }
  }
  return continu || exam || project;
}

function calculateSubjectAverage() {
  subjects.forEach((item) => {
    if (equalizeSubjectCoeff(item.grades) === false) {
      item.average = undefined;
      return;
    }
    item.average = 0;
    item.average +=
      item.grades.continu !== undefined
        ? item.grades.continu.average * item.grades.continu.coeff
        : 0;
    item.average +=
      item.grades.examen !== undefined
        ? item.grades.examen.average * item.grades.examen.coeff
        : 0;
    item.average +=
      item.grades.project !== undefined
        ? item.grades.project.average * item.grades.project.coeff
        : 0;
  });
}

function transformtoIntSubjectCoeff() {
  subjects.forEach((item) => {
    item.coeff = parseInt(item.coeff);
  });
}

function calculateModulesAverage() {
  const getAverage = (coeffs, grades) => {
    let val = 0;
    let coeff = 0;
    for (let i = 0; i < coeffs.length; i++) {
      if (grades[i] !== undefined) {
        val += coeffs[i] * grades[i];
        coeff += coeffs[i];
      }
    }
    if (coeff == 0) return undefined;
    return val / coeff;
  };
  let index = 0;
  modules.forEach((module) => {
    let coeffs = [];
    let grades = [];
    let bonus = 0;
    subjects.forEach((item) => {
      if (item.moduleId === index) {
        if (item.sub.includes("Bonus")) {
          if (item.average == undefined) return;
          bonus = item.average;
          bonus /= 20.0;
          return;
        }
        coeffs.push(item.coeff);
        grades.push(item.average);
      }
    });
    module.average = getAverage(coeffs, grades);
    if (module.average !== undefined) {
      module.average += bonus;
    }
    module.coeff = coeffs.reduce((i, n) => {
      return i + n;
    });
    index++;
  });
}

function modifyTable($table) {
  var $rows = $table.find("tr");
  $rows.each((index, item) => {
    let parent = item.parentNode;
    let children = item.querySelectorAll("td");
    let firstChild = children[0];
    if (parent.tagName === "THEAD") {
      if (index === 1) {
        let newTh = document.createElement("th");
        newTh.classList.add("entete-average");
        newTh.innerText = "Moyenne";
        item.appendChild(newTh);
      }
      return;
    }

    let newTd = document.createElement("td");
    newTd.classList.add("average");
    newTd.classList.add(
      firstChild.classList.contains("item-ens")
        ? "item-ens"
        : firstChild.classList.contains("item-fpc")
          ? "item-fpc"
          : "item-ev1",
    );
    newTd.setAttribute(
      "style",
      "font-weight: 400!important; text-align: center; border-right: 1px solid #d3d3d3;",
    );
    item.appendChild(newTd);
  });
}

function fillElem(average, elem) {
  if (average === undefined || average === NaN) return;
  elem.innerText = average;
}

function displayGradeAverage(item, module) {
  if (item === undefined) return;
  let children = item.row.children;
  if (module === false && item.grades.length === 0) return;
  //if(module === true) console.log(item)
  if (children !== undefined && item.average !== undefined) {
    fillElem(item.average.toFixed(2), children[children.length - 1]);
  }
}

function fillNewTd() {
  subjects.forEach((item) => {
    displayGradeAverage(item, true);
    displayGradeAverage(item.grades.continu, false);
    displayGradeAverage(item.grades.examen, false);
    displayGradeAverage(item.grades.project, false);
  });
  modules.forEach((item) => {
    displayGradeAverage(item, true);
  });
}

function removeUnwanted() {
  $("#resultat-note").arrive(".releve_note", function () {
    let $elem = $(this);
    $elem.remove();
  });
}

(function () {
  "use strict";
  const resultatsContainerId = "resultat-note"; //id de la grosse div principale qui contient tout
  const resultatsTableId = "table_note"; // id de la table qui contient tout
  const yearRowClass = "master"; // lignes des années (accordéon pour dropdown les notes)
  const semesterAndModuleRowClass = "item-ens"; // toute les infos sur la ligne indiquant le semestre
  const semesterStr = "Semestre";
  const semesterMistakeStr = "Semestre Académique";
  const moduleStr = ["Module", "MODULE", "LFH"];
  const moduleMistakeStr = ["Module Mineure"];
  const continuousStr = ["Continu"];
  const renameContinuousStr = "Continu";
  const examsStr = ["Exam"];
  const projectsStr = ["Projet"];
  const courseRowClass = "item-fpc"; // classe d'une ligne ou il ya une matière
  const coursePartClass = "item-ev1"; // sous item d'un cours (ex: controle continu, exam, etc.)
  const nameColumnClass = "libelle"; // classe du nom d'une colonne
  const resitColumnClass = "rattrapage"; //classe de la colonne rattrapage
  const averageColumnClass = "average";
  const gradeColumnClass = "note"; // classe de la colonne note
  const courseCoefficientClass = "ponderation"; // classe de la colonne coefficient
  const weightColumnClass = "coefficient"; // classe de la colonne pondération (ils ont inversé pondération et coefficient...)
  const semesterNumber = 2;

  $("#resultat-note").arrive("#table_note", function () {
    var $table = $(this);
    removeUnwanted();
    modifyTable($table);
    parseTable($table);
    // console.log(subjects);
    equalizeGrades();
    calculateEachGradesAverage();
    transformToFloatCoeffForEachSubject();
    calculateSubjectAverage();
    // console.log(subjects);
    transformtoIntSubjectCoeff();
    calculateModulesAverage();
    fillNewTd();
  });

  // on récupère la div principale
  const resultsContainer = document.querySelector(
    "#".concat(resultatsContainerId),
  );

  // si pas de div, ff
  if (!resultsContainer) {
    return;
  }

  // compte le nombre d'années (menu déroulant)
  const extractYearsCount = (table) => {
    const years = table.querySelectorAll(".".concat(yearRowClass));
    //console.log("number of years :", years.length)
    return years.length;
  };

  // renvoie une liste d'objets grades [{value, weight}, ...]
  const extractGrades = (str) => {
    let grades = str.split(" - ");
    grades = grades.map((grade) => {
      const gradeCoefficient = grade.split(" ");
      let gradeValue = parseFloat(gradeCoefficient[0]?.replace(",", "."));
      let gradeWeight = gradeCoefficient[1];
      if (
        gradeWeight === undefined ||
        gradeWeight === null ||
        gradeWeight === ""
      ) {
        gradeWeight = 100.0;
      } else {
        gradeWeight = gradeWeight.replace("(", "");
        gradeWeight = gradeWeight.replace(")", "");
        gradeWeight = parseFloat(gradeWeight.replace(",", "."));
      }

      if (gradeValue === NaN) {
        gradeValue = undefined;
      }

      return {
        value: gradeValue,
        weight: gradeWeight,
      };
    });
    return grades;
  };

  // renvoie pour une ligne de la table passé en paramètre un objet coursePart {name, weight, grades}
  const extractCoursePartFromTable = (coursePartRow) => {
    let coursePart = {
      name: coursePartRow.querySelector(".".concat(nameColumnClass)).innerText,
      weight: parseFloat(
        coursePartRow
          .querySelector(".".concat(weightColumnClass))
          .innerText.replace(",", "."),
      ),
      grades: extractGrades(
        coursePartRow.querySelector(".".concat(gradeColumnClass)).innerText,
      ),
    };
    return coursePart;
  };

  /**
   *
   * @param {*} courseRow
   * @returns
   */
  // renvoie pour une ligne de cours donné un objet {name, coefficient, resit}
  const extractCourseInformation = (courseRow) => {
    // Essayer de récupérer l'élément correspondant à la classe "average"
    const averageElement = courseRow.querySelector(
      ".".concat(averageColumnClass),
    );
    let averageValue = null;

    // Si l'élément existe, essayer de récupérer sa valeur
    if (averageElement) {
      const averageText = averageElement.innerText;
      averageValue = parseFloat(averageText);

      // Si la valeur est NaN (non numérique), on la met à null
      if (isNaN(averageValue)) {
        averageValue = null;
      }
    }

    return {
      name: courseRow.querySelector(".".concat(nameColumnClass)).innerText,
      coefficient: parseFloat(
        courseRow
          .querySelector(".".concat(courseCoefficientClass))
          .innerText.replace(",", "."),
      ),
      resit: parseFloat(
        courseRow.querySelector(".".concat(resitColumnClass)).innerText,
      ),
      average: averageValue, // Utilisation de la valeur vérifiée ou null
    };
  };

  //renvoie le nombre de cours
  const extractCourseNumberFromTable = (moduleRows) => {
    const rows = Array.from(moduleRows);
    let coursesRows = rows.filter((row) =>
      row.querySelector(".".concat(courseRowClass)),
    );
    return coursesRows.length;
  };

  // renvoie un cours particulier en fonction d'un index i et d'un module
  const extractCourseFromTable = (moduleRow, i) => {
    const rows = Array.from(moduleRow);
    let coursesRows = rows.filter((row) =>
      row.querySelector(".".concat(courseRowClass)),
    );
    const courseRowIndex = rows.indexOf(coursesRows[i]);
    let nextCourseRowIndex = rows.indexOf(coursesRows[i + 1]);
    if (nextCourseRowIndex === -1) {
      nextCourseRowIndex = rows.length;
    }
    const courseRows = rows.slice(courseRowIndex, nextCourseRowIndex);
    let course = {};
    if (courseRows.length >= 1) {
      course = extractCourseInformation(courseRows[0]);
    }
    for (let i = 1; i < courseRows.length; i++) {
      let { name, ...coursePart } = extractCoursePartFromTable(courseRows[i]);
      for (let j = 0; j < continuousStr.length; j++) {
        if (name.includes(continuousStr[j])) {
          name = renameContinuousStr;
          break;
        }
      }
      for (let j = 0; j < examsStr.length; j++) {
        if (name.includes(examsStr[j])) {
          name = examsStr[0];
          break;
        }
      }
      for (let j = 0; j < projectsStr.length; j++) {
        if (name.includes(projectsStr[j])) {
          name = projectsStr[0];
          break;
        }
      }
      course[name] = coursePart;
    }
    return course;
  };

  // renvoie un objet module {name}
  const extractModuleInformation = (moduleRow) => {
    return {
      name: moduleRow.querySelector(".".concat(nameColumnClass)).innerText,
    };
  };

  // renvoie le nombre de module de la table
  const extractModuleNumberFromTable = (semesterRows) => {
    const rows = Array.from(semesterRows);
    let modulesRows = rows.filter((row) =>
      row.querySelector(".".concat(semesterAndModuleRowClass)),
    );
    modulesRows = modulesRows.filter((row) => {
      for (let i = 0; i < moduleStr.length; i++) {
        if (row.innerText.includes(moduleStr[i])) {
          return true;
        }
      }
      return false;
    });
    return modulesRows.length;
  };

  // renvoie un module selon un semestre et un index i
  const extractModuleFromTable = (semesterRows, i) => {
    const rows = Array.from(semesterRows);
    //console.log("semester rows", semesterRows);
    let modulesRows = rows.filter((row) =>
      row.querySelector(".".concat(semesterAndModuleRowClass)),
    );
    modulesRows = modulesRows.filter((row) => {
      for (let i = 0; i < moduleStr.length; i++) {
        if (row.innerText.includes(moduleStr[i])) {
          return true;
        }
      }
      return false;
    });
    const moduleRowIndex = rows.indexOf(modulesRows[i]);
    let nextModuleRowIndex = rows.indexOf(modulesRows[i + 1]);
    if (nextModuleRowIndex === -1) {
      nextModuleRowIndex = rows.length;
    }
    const moduleRows = rows.slice(moduleRowIndex, nextModuleRowIndex);
    //console.log("module rows :", moduleRows);
    const courses = [];
    for (let i = 0; i < extractCourseNumberFromTable(moduleRows); i++) {
      const course = extractCourseFromTable(moduleRows, i);
      courses.push(extractCourseFromTable(moduleRows, i));
      //console.log("added course :", course);
    }
    return {
      ...extractModuleInformation(moduleRows[0]),
      courses: courses,
    };
  };

  // renvoie un objet semestre {name}
  const extractSemesterInformation = (semesterRow) => {
    return {
      name: semesterRow.querySelector(".".concat(nameColumnClass)).innerText,
    };
  };

  /**
   * Extract all the data for a
   * @param {Array<Element>} yearRows the rows of the table corresponding to the year
   * @param {number} i the index of the semester
   */
  // renvoie un semestre selon une année et un indice i
  const extractSemesterFromTable = (yearRows, i) => {
    const rows = Array.from(yearRows);
    const semestersAndModuleRows = rows.filter((row) =>
      row.querySelector(".".concat(semesterAndModuleRowClass)),
    );
    let semestersRows = semestersAndModuleRows.filter((row) =>
      row.innerText.includes(semesterStr),
    );
    semestersRows = semestersRows.filter(
      (row) => !row.innerText.includes(semesterMistakeStr),
    );
    const semesterRowIndex = rows.indexOf(semestersRows[i]);
    let nextSemesterRowIndex = rows.indexOf(semestersRows[i + 1]);
    if (nextSemesterRowIndex === -1) {
      nextSemesterRowIndex = rows.length;
    }
    const semesterRows = rows.slice(semesterRowIndex, nextSemesterRowIndex);
    const modules = [];
    for (let i = 0; i < extractModuleNumberFromTable(semesterRows); i++) {
      const module = extractModuleFromTable(semesterRows, i);
      modules.push(module);
      //console.log("added module :", module);
    }
    return {
      ...extractSemesterInformation(semesterRows[0]),
      modules: modules,
    };
  };

  // renvoie un objet year {name}
  const extractYearInformation = (yearRow) => {
    return {
      name: yearRow.querySelector(".".concat(nameColumnClass)).innerText,
    };
  };

  /**
   * Extract all the data for a year
   * @param {HTMLAllCollection} tableRows the rows of the table
   * @param {number} i the index of the year
   */
  // renvoie toute les infos d'une année en fonction des lignes de la table et d'un indice
  const extractYearFromTable = (tableRows, i) => {
    const rows = Array.from(tableRows);
    const yearsRows = rows.filter((row) =>
      row.classList.contains(yearRowClass),
    );
    const yearRowIndex = rows.indexOf(yearsRows[i]);
    const nextYearRowIndex = rows.indexOf(yearsRows[i + 1]);
    const yearRows = rows.slice(yearRowIndex, nextYearRowIndex);
    const semesters = [];
    for (let i = 0; i < semesterNumber; i++) {
      const semester = extractSemesterFromTable(yearRows, i);
      semesters.push(semester);
      //console.log("added semester :", );
    }
    return {
      ...extractYearInformation(yearRows[0]),
      semesters: semesters,
    };
  };

  /**
   * This functions remove all the part that are stucks between two
   * .item-ens that are not a module or doesn't have a name...
   * @param {HTMLAllCollection} tableRows the rows of the table
   */
  const removeUselessPartsFromTable = (tableRows) => {
    const rows = Array.from(tableRows);
    const semestersAndModuleRows = rows.filter((row) =>
      row.querySelector(".".concat(semesterAndModuleRowClass)),
    );
    for (let i = 0; i < semestersAndModuleRows.length; i++) {
      for (let j = 0; j < moduleStr.length; j++) {
        if (semestersAndModuleRows[i].innerText.includes(moduleMistakeStr[j])) {
          const rowIndex = rows.indexOf(semestersAndModuleRows[i]);
          tableRows.item(rowIndex).remove();
          break;
        }
      }
      if (semestersAndModuleRows[i].innerText === "") {
        // no name module that are a mistake
        const rowIndex = rows.indexOf(semestersAndModuleRows[i]);
        const nextRowIndex = rows.indexOf(semestersAndModuleRows[i + 1]);
        for (let j = rowIndex; j < nextRowIndex; j++) {
          tableRows.item(j).remove();
        }
      }
    }
  };

  resultsContainer.arrive("#".concat(resultatsTableId), (table) => {
    const yearsCount = extractYearsCount(table);
    const years = [];
    let tableRows = table.querySelectorAll("tr");
    //removeUselessPartsFromTable(tableRows); // clean the table
    tableRows = table.querySelectorAll("tr"); // update the tableRows
    for (let i = 0; i < yearsCount; i++) {
      const year = extractYearFromTable(tableRows, i);
      years.push(year);
      //console.log("added year :", year);
    }
    window.localStorage.clear();
    const json = JSON.stringify(years);
    window.localStorage.setItem("grades", json);
    window.parent.postMessage(json, "http://localhost:5173");
  });
})();
