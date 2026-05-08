import { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "../components/Buttons";

function InfoSection({ children }) {
  return (
    <div className="border-2 border-double border-(--c-purple-tech-40) rounded-lg text-(--c-purple-tech-40) p-5">
      {children}
    </div>
  );
}

function Questionnaire() {
  const [questionnaireType, setQuestionnaireType] = useState("allQuestions");
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsByTopic, setQuestionsByTopic] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [allContactsAnswers, setAllContactsAnswers] = useState([]);
  const [pageContactSubject, setPageContactSubject] = useState({});
  const [pageQuestionSubject, setPageQuestionSubject] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const topics = [
    { _id: "emotionalSafety", topic: "Emotional Safety and Depth" },
    { _id: "support", topic: "Support and Loyalty" },
    {
      _id: "authenticity",
      topic: "Authenticity (Trust, Integrity, Accountability",
    },
    { _id: "effort", topic: "Effort and Communication" },
    { _id: "personality", topic: "Personality and Enjoyment" },
    { _id: "growth", topic: "Growth and Inspiration" },
    { _id: "boundaries", topic: "Boundaries" },
  ];

  const pageTitle =
    questionnaireType == "contacts"
      ? `${pageContactSubject?.firstName} ${pageContactSubject?.nickname && pageContactSubject?.nickname} ${pageContactSubject?.lastName}`
      : pageQuestionSubject?.question || "";

  const typeMap = {
    allQuestions: {
      array: allQuestions,
      display: (entry) => entry.question.split("\n")[0],
    },
    contacts: {
      array: contacts,
      display: (entry) => `${entry.firstName} ${entry.lastName}`,
    },
    topic: { array: topics, display: (entry) => entry.topic },
  };
  const questionOptions = typeMap[questionnaireType].array.map((entry) => (
    //on select change page question subject
    <option value={entry._id} className="w-[400px]" key={entry._id}>
      {typeMap[questionnaireType].display(entry)}
    </option>
  ));

  let answerInput = [];

  function getAnswerInput(question, contact, index) {
    switch (question.displayType) {
      case "checkbox": {
        return question.options.map((option) => (
          <div
            className="flex gap-1 px-2 items-center"
            key={`contact${index}${option.text}`}
          >
            <input
              type="checkbox"
              id={`contact${index}${option.text}`}
              name={`contact${index}response`}
              value={option.text}
              checked={
                allContactsAnswers[index].questionOption?.includes(
                  option.text,
                ) || false
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setAllContactsAnswers((prev) =>
                    prev.map((answer, i) =>
                      i === index
                        ? {
                            ...answer,
                            questionOption: answer.questionOption
                              ? [...answer.questionOption, option.text]
                              : [option.text],
                          }
                        : answer,
                    ),
                  );
                } else {
                  setAllContactsAnswers((prev) =>
                    prev.map((answer, i) =>
                      i === index
                        ? {
                            ...answer,
                            questionOption: answer.questionOption?.filter(
                              (op) => op !== option.text,
                            ),
                          }
                        : answer,
                    ),
                  );
                }
              }}
            />
            <label htmlFor={`contact${index}${option.text}`}>
              {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
            </label>
          </div>
        ));
      }
      case "radio": {
        return question.options.map((option) => (
          <div
            className="flex gap-1 px-2 items-center"
            key={`contact${index}${option.text}`}
          >
            <input
              type="radio"
              id={`contact${index}${option.text}`}
              name={`contact${index}response`}
              value={option.text}
              checked={
                allContactsAnswers[index].questionOption?.includes(
                  option.text,
                ) || false
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setAllContactsAnswers((prev) =>
                    prev.map((answer, i) =>
                      i === index
                        ? question.questionType == "categorical"
                          ? {
                              ...answer,
                              questionOption: [option.text],
                            }
                          : {
                              ...answer,
                              questionOption: [option.text],
                              questionScore: option.baseScore,
                            }
                        : answer,
                    ),
                  );
                }
              }}
            />
            <label htmlFor={`contact${index}${option.text}`}>
              {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
            </label>{" "}
          </div>
        ));
      }
      case "slider": {
        if (!allContactsAnswers[index]) return null;
        if (!question.sliderConfig) {
          return (
            <div key={`contact${index}`}>
              <input
                type="range"
                id={`contact${index}response`}
                name={`contact${index}response`}
                min={`${Math.min(...question.options.map((op) => op.baseScore))}`}
                max={`${Math.max(...question.options.map((op) => op.baseScore))}`}
                list="sliderValues"
                value={
                  allContactsAnswers[index].questionOption
                    ? question.options
                        ?.find(
                          (o) =>
                            o.text ==
                            allContactsAnswers[index].questionOption[0],
                        )
                        ?.baseScore.toString()
                    : question.options[Math.floor(question.options.length / 2)]
                        .baseScore
                }
                onChange={(e) => {
                  const snapScore = snapSliderValue(
                    e.target.value,
                    question.options.map((o) => o.baseScore.toString()),
                  );
                  setAllContactsAnswers((prev) =>
                    prev.map((answer, i) =>
                      i === index
                        ? {
                            ...answer,
                            questionOption: [
                              question.options?.find(
                                (o) => o.baseScore?.toString() === snapScore,
                              ).text,
                            ],
                            questionScore: Number(snapScore),
                          }
                        : answer,
                    ),
                  );
                }}
              />
              <div className="flex justify-between text-xs">
                {question.options.map((op) => (
                  <p key={op.text}>{op.text}</p>
                ))}
              </div>
            </div>
          );
        }
        return (
          <div key={`contact${index}`}>
            <input
              type="range"
              id={`contact${index}response`}
              name={`contact${index}response`}
              list="sliderValues"
              min={`${question.sliderConfig.min}`}
              max={`${question.sliderConfig.max}`}
              step={`${question.sliderConfig.step}`}
              value={
                allContactsAnswers[index].questionOption
                  ? allContactsAnswers[index].questionOption[0]
                  : question.sliderConfig.scoreMap[
                      Math.floor(question.sliderConfig.scoreMap.length / 2)
                    ].value
              }
              onChange={(e) => {
                const snapScore = snapSliderValue(
                  e.target.value,
                  question.sliderConfig.scoreMap.map((o) => o.value.toString()),
                );
                setAllContactsAnswers((prev) =>
                  prev.map((answer, i) =>
                    i === index
                      ? {
                          ...answer,
                          questionOption: [snapScore],
                          questionScore: question.sliderConfig.scoreMap.find(
                            (op) => op.value.toString() == snapScore,
                          ).baseScore,
                        }
                      : answer,
                  ),
                );
              }}
            />
            <div className="flex justify-between">
              <p>{question.sliderConfig.minLabel}</p>
              <p>{question.sliderConfig.maxLabel}</p>
            </div>
          </div>
        );
      }
    }
  }
  if (questionnaireType == "allQuestions" && contacts.length > 0) {
    answerInput = contacts.map((contact, index) => (
      <li key={contact._id} className="mb-6">
        <fieldset>
          <legend className="flex gap-2 text-lg items-center">
            <img src="/imgs/Small-Friend-Icon.png" alt="" />
            <h3>{`${contact.firstName} ${contact.nickname ? `"${contact.nickname}"` : ""} ${contact.lastName}`}</h3>
          </legend>
          <div className="flex gap-2 py-1 pb-6 border-b-2">
            {pageQuestionSubject.options &&
              getAnswerInput(pageQuestionSubject, contact, index)}
          </div>
        </fieldset>
      </li>
    ));
  }

  const sliderValues = pageQuestionSubject.sliderConfig ? (
    <datalist id="sliderValues">
      {pageQuestionSubject.sliderConfig.scoreMap.map((option, index, arr) => (
        <option
          key={index}
          value={option.value.toString()}
          label={
            index === 0
              ? pageQuestionSubject.sliderConfig.minLabel
              : index === arr.length - 1
                ? pageQuestionSubject.sliderConfig.maxLabel
                : ""
          }
        ></option>
      ))}
    </datalist>
  ) : (
    <datalist id="sliderValues">
      {pageQuestionSubject.options?.map((option, index) => (
        <option
          key={index}
          value={option.baseScore?.toString()}
          label={option.text}
        ></option>
      ))}
    </datalist>
  );

  const fetchEvaluation = async () => {
    const response = await fetch("/api/evaluation/getEvaluation");
    const data = await response.json();

    const sortedAnswers = data.evaluation.map((question) => {
      if (question.displayType == "slider" && !question.sliderConfig) {
        return {
          ...question,
          options: question.options
            .slice()
            .sort((a, b) => a.baseScore - b.baseScore),
        };
      } else return question;
    });
    setAllQuestions(sortedAnswers);
    setPageQuestionSubject(sortedAnswers[0]);
    setContacts(data.contacts);
    setAllContactsAnswers(
      data.contacts.map(
        (contact) =>
          contact.evaluation?.find(
            (question) => question.questionId == data.evaluation[0]._id,
          ) ||
          (data.evaluation[0].displayType == "checkbox"
            ? {
                questionId: data.evaluation[0]._id,
                questionOption: null,
              }
            : {
                questionId: data.evaluation[0]._id,
                questionOption: null,
                questionScore: null,
              }),
      ),
    );
  };

  function questionChange(e) {
    if (questionnaireType != "contacts") {
      const newQuestion = allQuestions.find(
        (question) => question._id == e.target.value,
      );
      setPageQuestionSubject(newQuestion);
      setAllContactsAnswers(
        contacts.map(
          (contact) =>
            contact.evaluation?.find(
              (question) => question.questionId == newQuestion._id,
            ) ||
            (newQuestion.displayType == "checkbox"
              ? {
                  questionId: newQuestion._id,
                  questionOption: null,
                }
              : {
                  questionId: newQuestion._id,
                  questionOption: null,
                  questionScore: null,
                }),
        ),
      );
    } else {
      setPageContactSubject(
        contacts.find((contact) => contact._id == e.target.value),
      );
    }
  }

  function snapSliderValue(slider, valueArray) {
    let minDiff = Infinity;
    let snapTo = "";
    valueArray.forEach((value) => {
      if (Math.abs(Number(slider) - Number(value)) < minDiff) {
        snapTo = value;
        minDiff = Math.abs(Number(slider) - Number(value));
      }
    });

    return snapTo;
  }

  const saveAnswers = async () => {
    setIsSaving(true);
    const response = await fetch("/api/evaluation/saveAnswers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: contacts.map((contact, i) => {
          return { id: contact._id, question: allContactsAnswers[i] };
        }),
      }),
    });
    if (response.status === 200) {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
  }, []);

  return (
    <div
      className={`${isSaving && "pointer-events-none cursor-progress"} rounded-xl bg-(--c-purple-tech-20) w-[1000px] py-7 px-15 flex flex-col max-h-[820px]`}
    >
      <div className="flex items-center justify-end">
        <label htmlFor="questionChange" className="text-xs mr-2">
          {/*Question or Contact */}
          Select Question
        </label>
        <select
          name="questionChange"
          id="questionChange"
          className="bg-(--c-violet-void) rounded-md px-3 py-2 text-(--c-purple-tech-20) text-xs w-[400px]"
          value={
            questionnaireType != "contacts"
              ? pageQuestionSubject._id
              : pageContactSubject._id
          }
          onChange={(e) => questionChange(e)}
        >
          {questionOptions}
        </select>
      </div>
      <div className="flex">
        <h2>Question{questionnaireType == "contacts" && "s for"}:</h2>
      </div>

      <h1 className="text-2xl">{pageTitle?.split("\n")[0]}</h1>
      {pageTitle?.split("\n").length > 1 &&
        pageTitle
          .split("\n")
          .slice(1)
          .map((line, index) => (
            <p key={index} className="text-sm mb-1">
              {line}
            </p>
          ))}
      {pageQuestionSubject.displayType == "slider" && sliderValues}
      <ul className="grow overflow-auto pt-3">{answerInput}</ul>

      <div className="flex justify-between">
        <PrimaryButton innerText="save" onClick={saveAnswers} />
        <PrimaryButton innerText="save and next" />
      </div>
    </div>
  );
}

export default function Evaluation() {
  return (
    <main className="flex gap-5 p-4">
      {/*Side section */}
      <div className="max-w-[400px] flex flex-col gap-4">
        <InfoSection>
          <h3 className="text-center mb-2">What's This?</h3>
          <div className="flex items-center gap-1">
            <img src="imgs/thinker.png" className="" />
            <p className="text-xs">
              Want to know if your friends are fake or who your most reliable
              contacts are? Use the evaluation questions to rank your squad by
              score.
            </p>
          </div>
        </InfoSection>
        <div className="border-3 rounded-lg flex flex-col gap-4 p-3 text-(--c-purple-tech-40) text-xl">
          <h2>SETTINGS</h2>
          <PrimaryButton innerText="full evaluation" />
          <PrimaryButton innerText="one friend at a time" />
          <PrimaryButton innerText="topic specific" />
          <PrimaryButton innerText="custom friend group" />
        </div>
        <InfoSection>
          <h3 className="text-center mb-2">Notes</h3>
          <div className="flex items-center gap-1">
            <img src="imgs/takeevaluation.png" className="" />
            <ul className="text-xs">
              <li>To truly evaluate your squad may take an hour or two</li>
              <li>
                Save periodically. You can always come back to questions later
                or change them as you go.
              </li>
            </ul>
          </div>
        </InfoSection>
      </div>
      <Questionnaire />
    </main>
  );
}
