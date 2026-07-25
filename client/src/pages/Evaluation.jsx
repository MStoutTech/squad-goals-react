import { useState, useEffect, useRef, useContext } from "react";
import { ToastContext } from "../context/ToastContext";
import { PrimaryModal } from "../components/Modals";
import { PrimaryButton } from "../components/Buttons";
import ContactSearch from "../components/Search";
import {
  ContactAvatar,
  SelectedContactChip,
} from "../components/ContactAvatar";
import { apiFetch } from "../utils/apiUrl";

function InfoSection({ children }) {
  return (
    <div className="hidden md:block border-2 border-double border-(--c-purple-tech-40) rounded-lg text-(--c-purple-tech-40) p-5">
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
  const { showToast } = useContext(ToastContext);
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
          <label
            htmlFor={`contact${index}${option.text}`}
            className="flex gap-1 px-2 items-center h-[44px]"
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

            {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
          </label>
        ));
      }
      case "radio": {
        if (
          (questionnaireType != "contacts" && !allContactsAnswers[index]) ||
          (questionnaireType == "contacts" && !singleContactAnswers[index])
        )
          return null;
        return question.options.map((option) => (
          <label
            htmlFor={`contact${index}${option.text}`}
            className="flex gap-1 px-2 items-center h-[44px]"
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

            {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
          </label>
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
            <div className="w-full" key={`contact${index}`}>
              <input
                type="range"
                id={`contact${index}response`}
                name={`contact${index}response`}
                min={`${Math.min(...question.options.map((op) => op.baseScore))}`}
                max={`${Math.max(...question.options.map((op) => op.baseScore))}`}
                list="sliderValues"
                className="w-full"
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
          <div className="w-full" key={`contact${index}`}>
            <input
              type="range"
              id={`contact${index}response`}
              name={`contact${index}response`}
              list="sliderValues"
              min={`${question.sliderConfig.min}`}
              max={`${question.sliderConfig.max}`}
              step={`${question.sliderConfig.step}`}
              className="w-full"
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
            <ContactAvatar
              className="inline size-6 border-2 rounded-full"
              contact={contact}
            />
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
    pageContactSubject &&
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
      {/*TODO: label conditional on screen size */}
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
    const response = await apiFetch("/api/evaluation/getEvaluation");
    const data = await response.json();

    if (data.contacts) {
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
        pageQuestionSubject && Object.keys(pageQuestionSubject).length < 1
          ? sortedAnswers[0]
          : pageQuestionSubject;
      const selectedContact =
        pageContactSubject && Object.keys(pageContactSubject).length < 1
          ? data.contacts[0]
          : pageContactSubject;
      setAllQuestions(sortedAnswers);
      if (pageQuestionSubject && Object.keys(pageQuestionSubject).length < 1) {
        setPageQuestionSubject(sortedAnswers[0]);
      }
      setContacts(data.contacts);
      setAllContactsAnswers(
        data.contacts?.map(
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
      if (pageContactSubject && Object.keys(pageContactSubject).length < 1) {
        setPageContactSubject(selectedContact);
      }
      setSingleContactAnswers(
        sortedAnswers.map(
          (question) =>
            selectedContact?.evaluation?.find(
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
        contactList?.map(
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
    try {
      let response;
      if (questionnaireType !== "contacts") {
        const contactList =
          questionnaireType == "custom" ? customGroup : contacts;
        response = await apiFetch("/api/evaluation/saveAnswers", {
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
        response = await apiFetch(
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
        showToast("Saved answers", "success");
      }
      if (response.status === 500) {
        showToast(`Could not save answers. Refresh and try again.`, "error");
      }
      setIsSaving(false);
    } catch (err) {
      setIsSaving(false);
      showToast(
        `Could not save answers. Check your connection and try again.`,
        "error",
      );
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
          ? contacts?.map(
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
      pageQuestionSubject &&
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
      pageQuestionSubject &&
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
      pageContactSubject &&
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
      className={`${isSaving && "cursor-progress"} rounded-xl bg-(--c-purple-tech-20) md:w-[1000px] py-7 px-7 lg:px-15 flex flex-col lg:min-h-[450px] lg:max-h-[calc(100vh-6rem)] mb-20 lg:mb-0`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-end">
        <label htmlFor="questionChange" className="text-xs mr-2">
          {/*Question or Contact */}
          {questionnaireType == "contacts"
            ? "Select Friend"
            : "Select Question"}
        </label>
        <select
          name="questionChange"
          id="questionChange"
          className="bg-(--c-violet-void) rounded-md px-3 py-2 text-purple-300 text-xs md:w-[400px] h-[44px]"
          value={
            questionnaireType != "contacts"
              ? pageQuestionSubject?._id
              : pageContactSubject
                ? pageContactSubject?._id
                : "none"
          }
          onChange={(e) => questionChange(e)}
        >
          {contacts.length > 0 ? (
            questionOptions
          ) : (
            <option value={"none"} className="w-[400px]" key={"none"} disabled>
              No contacts
            </option>
          )}
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
      <ul className="grow overflow-auto pt-3">
        {contacts.length > 0 ? (
          answerInput
        ) : (
          <li className="p-4 rounded-lg bg-(--c-light-coral) mb-2">
            No available contacts. Add contacts on squad page
          </li>
        )}
      </ul>

      {contacts.length > 0 && (
        <div className="flex justify-between">
          <PrimaryButton innerText="save" onClick={saveAnswers} />
          <PrimaryButton innerText="save and next" onClick={saveAndNext} />
        </div>
      )}
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
    <main className="flex flex-col md:flex-row gap-5 p-2 md:p-4 lg:pt-12">
      {/*Side section */}
      <div className="md:max-w-[400px] flex flex-col gap-4">
        <InfoSection>
          <h3 className="text-center mb-2">What's This?</h3>
          <div className="flex items-center justify-center gap-1 flex-wrap-reverse">
            <div className="w-[90px] m-x-auto shrink-0">
              <img src="imgs/thinker.png" className="w-full" alt="" />
            </div>
            <div className="text-xs flex-1 min-w-[90px]">
              <p>
                Want to know if your friends are fake or who your most reliable
                contacts are? Use the evaluation questions to rank your squad by
                score.
              </p>
            </div>
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
            divClassName="w-full"
          />
          <PrimaryButton
            innerText="one friend at a time"
            onClick={() => {
              setQuestionnaireType("contacts");
              setSelectedTopic("");
            }}
            isActive={"contacts" == questionnaireType}
            divClassName="w-full"
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
            divClassName="w-full"
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
            divClassName="w-full"
          />
        </div>
        <InfoSection>
          <h3 className="text-center mb-2">Notes</h3>
          <div className="flex items-center justify-center gap-1 flex-wrap-reverse">
            <div className="w-[90px] m-x-auto shrink-0">
              <img src="imgs/takeevaluation.png" className="w-full" alt="" />
            </div>

            <ul className="text-xs flex-1 min-w-[90px]">
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
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  function startEvaluation() {
    if (!customGroup.length) {
      setShowErrorMessage(true);
      return;
    }
    setShowErrorMessage(false);
    setQuestionnaireType("custom");
    setSelectedTopic("");
    closeModal();
  }

  const selectedList = customGroup.map((contact) => (
    <SelectedContactChip
      contactObject={contact}
      removeFunction={() =>
        setCustomGroup((prev) => prev.filter((c) => c._id != contact._id))
      }
      key={contact._id}
    />
  ));

  return (
    <PrimaryModal
      windowTitle="Custom List Selection"
      closeModal={closeModal}
      formId=""
      submitButtonText="START EVALUATION"
      outsideClick={closeModal}
      confirmOnClick={startEvaluation}
    >
      {customGroup.length < 15 ? (
        <ContactSearch
          onSelect={(contact) => {
            setShowErrorMessage(false);
            setCustomGroup((prev) => [...prev, contact]);
          }}
          excludeIds={customGroup.map((contact) => contact._id)}
          clearOnSelect={true}
        />
      ) : (
        <p>Custom List Limit Reached</p>
      )}

      <div className="flex flex-col max-h-[500px] overflow-auto">
        {showErrorMessage && <span>Must Select Contacts</span>}
        {selectedList}
      </div>
    </PrimaryModal>
  );
}
