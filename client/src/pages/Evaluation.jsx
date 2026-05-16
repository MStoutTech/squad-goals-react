import { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "../components/Buttons";
import ContactSearch from "../components/Search";

function InfoSection({ children }) {
  return (
    <div className="border-2 border-double border-(--c-purple-tech-40) rounded-lg text-(--c-purple-tech-40) p-5">
      {children}
    </div>
  );
}

function Questionnaire({ selectedTopic, questionnaireType, customGroup }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [questionsByTopic, setQuestionsByTopic] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [allContactsAnswers, setAllContactsAnswers] = useState([]);
  const [singleContactAnswers, setSingleContactAnswers] = useState([]);
  const [pageContactSubject, setPageContactSubject] = useState({});
  const [pageQuestionSubject, setPageQuestionSubject] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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
    topic: {
      array: questionsByTopic,
      display: (entry) => entry.question.split("\n")[0],
    },
    custom: {
      array: allQuestions,
      display: (entry) => entry.question.split("\n")[0],
    },
  };
  const questionOptions = typeMap[questionnaireType].array.map((entry) => (
    //on select change page question subject
    <option value={entry._id} className="w-[400px]" key={entry._id}>
      {typeMap[questionnaireType].display(entry)}
    </option>
  ));

  let answerInput = [];

  function getAnswerInput(question, contact, index) {
    const activeAnswerArray =
      questionnaireType == "contacts"
        ? singleContactAnswers
        : allContactsAnswers;
    const activeSetter =
      questionnaireType == "contacts"
        ? setSingleContactAnswers
        : setAllContactsAnswers;
    switch (question.displayType) {
      case "checkbox": {
        if (
          (questionnaireType != "contacts" && !allContactsAnswers[index]) ||
          (questionnaireType == "contacts" && !singleContactAnswers[index])
        )
          return null;
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
                activeAnswerArray[index].questionOption?.includes(
                  option.text,
                ) || false
              }
              onChange={(e) => {
                if (e.target.checked) {
                  activeSetter((prev) =>
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
                  activeSetter((prev) =>
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
        if (
          (questionnaireType != "contacts" && !allContactsAnswers[index]) ||
          (questionnaireType == "contacts" && !singleContactAnswers[index])
        )
          return null;
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
                activeAnswerArray[index].questionOption?.includes(
                  option.text,
                ) || false
              }
              onChange={(e) => {
                if (e.target.checked) {
                  activeSetter((prev) =>
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
        if (
          (questionnaireType != "contacts" && !allContactsAnswers[index]) ||
          (questionnaireType == "contacts" && !singleContactAnswers[index])
        )
          return null;
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
                  activeAnswerArray[index]?.questionOption
                    ? question.options
                        ?.find(
                          (o) =>
                            o.text ==
                            activeAnswerArray[index]?.questionOption[0],
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
                  activeSetter((prev) =>
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
                activeAnswerArray[index]?.questionOption
                  ? activeAnswerArray[index]?.questionOption[0]
                  : question.sliderConfig.scoreMap[
                      Math.floor(question.sliderConfig.scoreMap.length / 2)
                    ].value
              }
              onChange={(e) => {
                const snapScore = snapSliderValue(
                  e.target.value,
                  question.sliderConfig.scoreMap.map((o) => o.value.toString()),
                );
                activeSetter((prev) =>
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
  if (questionnaireType != "contacts" && contacts.length > 0) {
    const contactList = questionnaireType == "custom" ? customGroup : contacts;
    answerInput = contactList.map((contact, index) => (
      <li key={contact._id} className="mb-6">
        <fieldset>
          <legend className="flex gap-2 text-lg items-center">
            <img src="/imgs/Small-Friend-Icon.png" alt="" />
            <h3>{`${contact.firstName} ${contact.nickname ? `"${contact.nickname}"` : ""} ${contact.lastName}`}</h3>
          </legend>
          <div className="flex flex-wrap gap-2 py-1 pb-6 border-b-2">
            {pageQuestionSubject.options &&
              getAnswerInput(pageQuestionSubject, contact, index)}
          </div>
        </fieldset>
      </li>
    ));
  }
  if (
    questionnaireType == "contacts" &&
    Object.keys(pageContactSubject)?.length > 0
  ) {
    answerInput = allQuestions.map((question, index) => (
      <li key={question._id} className="mb-6">
        <fieldset>
          <legend className="flex flex-col gap-2 text-lg">
            <h3>{question.question.split("\n")[0]}</h3>
            {question.question.split("\n").length > 1 &&
              question.question
                .split("\n")
                .slice(1)
                .map((line, i) => (
                  <p key={i} className="text-sm mb-1">
                    {line}
                  </p>
                ))}
          </legend>
          <div className="flex flex-wrap gap-2 py-1 pb-6 border-b-2">
            {question.options &&
              getAnswerInput(question, pageContactSubject, index)}
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

    const selectedQuestion =
      Object.keys(pageQuestionSubject).length < 1
        ? sortedAnswers[0]
        : pageQuestionSubject;
    const selectedContact =
      Object.keys(pageContactSubject).length < 1
        ? data.contacts[0]
        : pageContactSubject;
    setAllQuestions(sortedAnswers);
    if (Object.keys(pageQuestionSubject).length < 1) {
      setPageQuestionSubject(sortedAnswers[0]);
    }
    setContacts(data.contacts);
    setAllContactsAnswers(
      data.contacts.map(
        (contact) =>
          contact.evaluation?.find(
            (question) => question.questionId == selectedQuestion._id,
          ) ||
          (selectedQuestion.displayType == "checkbox"
            ? {
                questionId: selectedQuestion._id,
                questionOption: null,
              }
            : {
                questionId: selectedQuestion._id,
                questionOption: null,
                questionScore: null,
              }),
      ),
    );
    if (Object.keys(pageContactSubject).length < 1) {
      setPageContactSubject(selectedContact);
    }
    setSingleContactAnswers(
      sortedAnswers.map(
        (question) =>
          selectedContact.evaluation?.find(
            (entry) => entry.questionId == question._id,
          ) ||
          (question.displayType == "checkbox"
            ? {
                questionId: question._id,
                questionOption: null,
              }
            : {
                questionId: question._id,
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
      const contactList =
        questionnaireType == "custom" ? customGroup : contacts;
      setPageQuestionSubject(newQuestion);
      setAllContactsAnswers(
        contactList.map(
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
      const newSelection = contacts.find(
        (contact) => contact._id == e.target.value,
      );
      setPageContactSubject(newSelection);
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
    let response;
    if (questionnaireType !== "contacts") {
      const contactList =
        questionnaireType == "custom" ? customGroup : contacts;
      response = await fetch("/api/evaluation/saveAnswers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: contactList.map((contact, i) => {
            return { id: contact._id, question: allContactsAnswers[i] };
          }),
        }),
      });
    } else {
      response = await fetch(
        `/api/evaluation/${pageContactSubject._id}/saveAnswers`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: singleContactAnswers,
          }),
        },
      );
    }
    if (response.status === 200) {
      const data = await response.json();
      setContacts((prev) =>
        prev.map(
          (contact) =>
            data.updatedContacts.find(
              (updated) => updated._id == contact._id,
            ) || contact,
        ),
      );
      setIsSaving(false);
    }
  };

  async function saveAndNext() {
    await saveAnswers();
    const pageSubject =
      questionnaireType == "contacts"
        ? pageContactSubject
        : pageQuestionSubject;
    const setPageSubject =
      questionnaireType == "contacts"
        ? setPageContactSubject
        : setPageQuestionSubject;
    const questionList =
      questionnaireType == "topic"
        ? questionsByTopic
        : questionnaireType == "contacts"
          ? contacts
          : allQuestions;
    const questionIndex = questionList.findIndex(
      (question) => question._id == pageSubject._id,
    );
    if (questionIndex < questionList.length - 1) {
      setPageSubject(questionList[questionIndex + 1]);
    } else {
      setPageSubject(questionList[0]);
    }
  }

  useEffect(() => {
    fetchEvaluation();
  }, []);

  useEffect(() => {
    if (selectedTopic != "") {
      const filteredQuestions =
        allQuestions.filter((question) =>
          question.topic?.includes(selectedTopic),
        ) || [];
      setQuestionsByTopic(filteredQuestions);
      setPageQuestionSubject(filteredQuestions[0] || {});
      setAllContactsAnswers(
        filteredQuestions[0]
          ? contacts.map(
              (contact) =>
                contact.evaluation?.find(
                  (question) => question.questionId == filteredQuestions[0]._id,
                ) ||
                (filteredQuestions[0].displayType == "checkbox"
                  ? {
                      questionId: filteredQuestions[0]._id,
                      questionOption: null,
                    }
                  : {
                      questionId: filteredQuestions[0]._id,
                      questionOption: null,
                      questionScore: null,
                    }),
            )
          : [],
      );
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (
      questionnaireType == "custom" &&
      customGroup.length > 0 &&
      Object.keys(pageQuestionSubject).length > 0
    ) {
      setAllContactsAnswers(
        customGroup.map(
          (contact) =>
            contact.evaluation?.find(
              (question) => question.questionId == pageQuestionSubject._id,
            ) ||
            (pageQuestionSubject.displayType == "checkbox"
              ? {
                  questionId: pageQuestionSubject._id,
                  questionOption: null,
                }
              : {
                  questionId: pageQuestionSubject._id,
                  questionOption: null,
                  questionScore: null,
                }),
        ),
      );
    }
  }, [customGroup]);

  useEffect(() => {
    if (
      questionnaireType == "allQuestions" &&
      contacts.length > 0 &&
      Object.keys(pageQuestionSubject).length > 0
    ) {
      setAllContactsAnswers(
        contacts.map(
          (contact) =>
            contact.evaluation?.find(
              (question) => question.questionId == pageQuestionSubject._id,
            ) ||
            (pageQuestionSubject.displayType == "checkbox"
              ? {
                  questionId: pageQuestionSubject._id,
                  questionOption: null,
                }
              : {
                  questionId: pageQuestionSubject._id,
                  questionOption: null,
                  questionScore: null,
                }),
        ),
      );
    }
  }, [questionnaireType]);

  useEffect(() => {
    if (
      Object.keys(pageContactSubject).length > 0 &&
      questionnaireType == "contacts"
    ) {
      setSingleContactAnswers(
        allQuestions.map(
          (question) =>
            pageContactSubject.evaluation?.find(
              (entry) => entry.questionId == question._id,
            ) ||
            (question.displayType == "checkbox"
              ? {
                  questionId: question._id,
                  questionOption: null,
                }
              : {
                  questionId: question._id,
                  questionOption: null,
                  questionScore: null,
                }),
        ),
      );
    }
  }, [pageContactSubject]);

  return (
    <div
      className={`${isSaving && "cursor-progress"} rounded-xl bg-(--c-purple-tech-20) w-[1000px] py-7 px-15 flex flex-col max-h-[820px]`}
    >
      <div className="flex items-center justify-end">
        <label htmlFor="questionChange" className="text-xs mr-2">
          {/*Question or Contact */}
          {questionnaireType == "contacts"
            ? "Select Friend"
            : "Select Question"}
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
        <PrimaryButton innerText="save and next" onClick={saveAndNext} />
      </div>
    </div>
  );
}

export default function Evaluation() {
  const [questionnaireType, setQuestionnaireType] = useState("allQuestions");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [showTopicsList, setShowTopicsList] = useState(false);
  const [customGroup, setCustomGroup] = useState([]);
  const [isCustomSelectModalOpen, setIsCustomSelectModalOpen] = useState(false);

  const topics = {
    emotionalSafety: "Emotional Safety and Depth",
    support: "Support and Loyalty",
    authenticity: "Authenticity",
    effort: "Effort and Communication",
    personality: "Personality and Enjoyment",
    growth: "Growth and Inspiration",
    boundaries: "Boundaries",
  };

  const topicsList = Object.keys(topics).map((topic) => (
    <li
      key={topic}
      onClick={() => selectTopic(topic)}
      className="p-2 hover:bg-purple-400 cursor-pointer"
    >
      {topics[topic]}
    </li>
  ));

  function selectTopic(topic) {
    setSelectedTopic(topic);
    setQuestionnaireType("topic");
    setShowTopicsList(false);
  }
  function toggleShowTopics() {
    setShowTopicsList((showTopicsList) => !showTopicsList);
  }

  function closeModal() {
    setIsCustomSelectModalOpen(false);
  }
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
          <PrimaryButton
            innerText="full evaluation"
            onClick={() => {
              setQuestionnaireType("allQuestions");
              setSelectedTopic("");
            }}
            isActive={"allQuestions" == questionnaireType}
          />
          <PrimaryButton
            innerText="one friend at a time"
            onClick={() => {
              setQuestionnaireType("contacts");
              setSelectedTopic("");
            }}
            isActive={"contacts" == questionnaireType}
          />
          <PrimaryButton
            innerText={
              selectedTopic !== ""
                ? `topic: ${topics[selectedTopic].split(" ")[0]}`
                : "topic specific"
            }
            onClick={() => {
              toggleShowTopics();
            }}
            isActive={"topic" == questionnaireType}
          />
          {showTopicsList && (
            <ul className="absolute z-50 bg-(--c-violet-void) border border-purple-300 rounded-md mt-1 text-white max-h-40 overflow-y-auto text-sm">
              {topicsList}
            </ul>
          )}
          <PrimaryButton
            innerText="custom friend group"
            onClick={() => {
              setIsCustomSelectModalOpen(true);
            }}
            isActive={"custom" == questionnaireType}
          />
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
      <Questionnaire
        selectedTopic={selectedTopic}
        questionnaireType={questionnaireType}
        customGroup={customGroup}
      />
      {isCustomSelectModalOpen && (
        <CustomSelectionModal
          closeModal={closeModal}
          customGroup={customGroup}
          setCustomGroup={setCustomGroup}
          setQuestionnaireType={setQuestionnaireType}
          setSelectedTopic={setSelectedTopic}
        />
      )}
    </main>
  );
}

function CustomSelectionModal({
  closeModal,
  customGroup,
  setCustomGroup,
  setQuestionnaireType,
  setSelectedTopic,
}) {
  function startEvaluation() {
    setQuestionnaireType("custom");
    setSelectedTopic("");
    closeModal();
  }

  const selectedList = customGroup.map((contact) => (
    <div className="flex mb-2" key={contact._id}>
      <span className="mr-3">{`${contact.firstName} ${contact.lastName}`}</span>
      <span
        className="cursor-pointer border-1 rounded px-2"
        onClick={() =>
          setCustomGroup((prev) => prev.filter((c) => c._id != contact._id))
        }
      >
        X
      </span>
    </div>
  ));

  return (
    <div
      id="custom-selection-modal"
      aria-labelledby="custom-list-selection"
      className="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent z-20"
    >
      <div
        className="fixed inset-0 bg-black/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        onClick={closeModal}
      ></div>

      <div
        tabIndex="0"
        className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
      >
        <div className="relative transform border border-purple-300 rounded-lg bg-black/60 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
          <div className="bg-(--c-purple-tech-40)/40 min-h-[200px] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left ">
              {/*Window title*/}
              <h3
                id="dialog-title"
                className="text-base font-semibold text-gray-900"
              >
                Custom List Selection
              </h3>

              <div className="mt-2 text-purple-300 text-sm ">
                {customGroup.length < 15 ? (
                  <ContactSearch
                    onSelect={(contact) =>
                      setCustomGroup((prev) => [...prev, contact])
                    }
                    excludeIds={customGroup.map((contact) => contact._id)}
                    clearOnSelect={true}
                  />
                ) : (
                  <p>Custom List Limit Reached</p>
                )}
                <div className="flex flex-col max-h-[500px] overflow-auto">
                  {selectedList}
                </div>
              </div>
            </div>
          </div>
          {/*Window buttons*/}
          <div className="bg-(--c-violet-void-40) px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              form="add-contact-form"
              type="button"
              onClick={startEvaluation}
              className="inline-flex w-full justify-center rounded-md action-button sm:ml-3 sm:w-auto px-3 py-2 text-sm shadow-xs hover:bg-(--c-violet-void)"
            >
              START EVALUATION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
