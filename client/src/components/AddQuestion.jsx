import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { PrimaryButton } from "./Buttons";
import { apiFetch } from "../utils/apiUrl";

export default function AddQuestion() {
  const [isLoading, setIsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    questionType: null,
    displayType: null,
    topic: [],
    options: [],
    sliderConfig: null,
  });
  const [isTrueSlider, setIsTrueSlider] = useState("false");
  const [sliderBaseScore, setSliderBaseScore] = useState({
    min: "",
    max: "",
  });
  //Todo: remove option button
  const answerOptions = newQuestion.options.map((entry, index) => (
    <li className="flex gap-3" key={index}>
      <label htmlFor={`option${index}text`} className="text-xs text-white">
        Answer Text
        <input
          name={`option${index}text`}
          type="text"
          className="border border-purple-300 rounded-md px-3 py-2 mb-6"
          value={entry.text}
          onChange={(e) =>
            setNewQuestion((prev) => {
              const updatedOption = prev.options.map((old, i) =>
                i === index ? { ...old, text: e.target.value } : old,
              );
              return { ...prev, options: updatedOption };
            })
          }
        />
      </label>
      {newQuestion.questionType == "scored" && (
        <label
          htmlFor={`option${index}baseScore`}
          className="text-xs text-white"
        >
          {"Answer Base Score (number only)"}
          <input
            name={`option${index}baseScore`}
            type="text"
            className="border border-purple-300 w-[40px] rounded-md px-3 py-2 mb-6"
            value={entry.baseScore}
            onChange={(e) =>
              setNewQuestion((prev) => {
                const updatedOption = prev.options.map((old, i) =>
                  i === index ? { ...old, baseScore: e.target.value } : old,
                );
                return { ...prev, options: updatedOption };
              })
            }
          />
        </label>
      )}
    </li>
  ));

  function addOption() {
    setNewQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", baseScore: "" }],
    }));
  }

  function addTrueSlider() {
    setNewQuestion((prev) => ({
      ...prev,
      sliderConfig: {
        min: "",
        max: "",
        step: "",
        minLabel: "",
        maxLabel: "",
      },
    }));
  }

  function removeTrueSlider() {
    setNewQuestion((prev) => ({
      ...prev,
      sliderConfig: null,
    }));
  }
  function buildScoreMap() {
    const values = [];
    const convertedMin = Number(newQuestion.sliderConfig.min);
    const convertedMax = Number(newQuestion.sliderConfig.max);
    const convertedStep = Number(newQuestion.sliderConfig.step);
    const convertedBaseMin = Number(sliderBaseScore.min);
    const convertedBaseMax = Number(sliderBaseScore.max);
    for (let v = convertedMin; v <= convertedMax; v += convertedStep) {
      values.push(v);
    }
    const baseScoreIncrement =
      (convertedBaseMax - convertedBaseMin) / (values.length - 1);

    const scoreMap = values.map((v, i) => {
      return { value: v, baseScore: convertedBaseMin + i * baseScoreIncrement };
    });

    return scoreMap;
  }

  async function submitQuestion() {
    setIsLoading(true);
    const scoreMap = newQuestion.sliderConfig ? buildScoreMap() : [];

    const formattedQuestion = {
      question: newQuestion.question,
      questionType: newQuestion.questionType,
      displayType: newQuestion.displayType,
      topic: newQuestion.topic.length > 0 ? newQuestion.topic : null,
      isActive: true,
      options: newQuestion.options,
      sliderConfig: newQuestion.sliderConfig
        ? { ...newQuestion.sliderConfig, scoreMap: scoreMap }
        : null,
    };
    const response = await apiFetch(`/api/evaluation/addQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedQuestion),
    });

    if (response.status === 201) {
      setNewQuestion({
        question: "",
        questionType: null,
        displayType: null,
        topic: [],
        options: [],
        sliderConfig: null,
      });
      setIsLoading(false);
      setIsTrueSlider("false");
      setSliderBaseScore({ min: "", max: "" });
    }
  }

  return (
    <div className="border border-white rounded-lg p-3">
      <h3 className="text-base font-semibold text-white">Add New Question</h3>
      {isLoading ? (
        <CircularProgress color="#7D4C9F" />
      ) : (
        <div className="flex flex-col mt-2 text-purple-300 text-sm">
          <label htmlFor="questionText" className="text-xs text-white">
            Question Text
          </label>
          <textarea
            name="questionText"
            className="border border-purple-300 rounded-md px-3 py-2 mb-6"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion((prev) => ({
                ...prev,
                question: e.target.value,
              }))
            }
            required
          />
          <fieldset className="flex flex-wrap max-w-[400px] mb-6">
            <legend className="text-xs text-white">Question Type</legend>
            <div className="flex gap-1 px-2 items-center">
              <input
                type="radio"
                id="scoredTypeQuestion"
                name="questionType"
                value="scored"
                checked={newQuestion.questionType == "scored"}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    questionType: e.target.value,
                  }))
                }
              />
              <label htmlFor="scoredTypeQuestion">Scored</label>
            </div>
            <div className="flex gap-1 px-2 items-center">
              <input
                type="radio"
                id="categoricalTypeQuestion"
                name="questionType"
                value="categorical"
                checked={newQuestion.questionType == "categorical"}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    questionType: e.target.value,
                  }))
                }
              />
              <label htmlFor="categoricalTypeQuestion">Categorical</label>
            </div>
          </fieldset>
          <fieldset className="flex flex-wrap max-w-[400px] mb-6">
            <legend className="text-xs text-white">Answer Display Type</legend>
            {(newQuestion.questionType == "categorical" ||
              newQuestion.questionType == "scored") && (
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="radio"
                  id="radioDisplay"
                  name="displayType"
                  value="radio"
                  checked={newQuestion.displayType == "radio"}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      displayType: e.target.value,
                    }))
                  }
                />
                <label htmlFor="radioDisplay">Radio</label>
              </div>
            )}
            {newQuestion.questionType == "categorical" && (
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="radio"
                  id="checkboxDisplay"
                  name="displayType"
                  value="checkbox"
                  checked={newQuestion.displayType == "checkbox"}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      displayType: e.target.value,
                    }))
                  }
                />
                <label htmlFor="checkboxDisplay">Checkbox</label>
              </div>
            )}
            {newQuestion.questionType == "scored" && (
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="radio"
                  id="sliderDisplay"
                  name="displayType"
                  value="slider"
                  checked={newQuestion.displayType == "slider"}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      displayType: e.target.value,
                    }))
                  }
                />
                <label htmlFor="sliderDisplay">Slider</label>
              </div>
            )}
          </fieldset>
          {newQuestion.questionType == "scored" &&
            newQuestion.displayType == "slider" && (
              <fieldset className="flex flex-wrap max-w-[400px] mb-6">
                <legend className="text-xs text-white">
                  True Slider Scale?
                </legend>
                <div className="flex gap-1 px-2 items-center">
                  <input
                    type="radio"
                    id="noSlider"
                    name="isTrueSlider"
                    value="false"
                    checked={isTrueSlider == "false"}
                    onChange={(e) => {
                      setIsTrueSlider(e.target.value);
                      if (e.target.value == "true") {
                        addTrueSlider();
                      } else if (e.target.value == "false") {
                        removeTrueSlider();
                      }
                    }}
                  />
                  <label htmlFor="noSlider">No</label>
                </div>
                <div className="flex gap-1 px-2 items-center">
                  <input
                    type="radio"
                    id="yesSlider"
                    name="isTrueSlider"
                    value="true"
                    checked={isTrueSlider == "true"}
                    onChange={(e) => {
                      setIsTrueSlider(e.target.value);
                      if (e.target.value == "true") {
                        addTrueSlider();
                      } else if (e.target.value == "false") {
                        removeTrueSlider();
                      }
                    }}
                  />
                  <label htmlFor="yesSlide">Yes</label>
                </div>
              </fieldset>
            )}
          {newQuestion.questionType == "scored" && (
            <fieldset className="flex flex-wrap max-w-[400px] mb-6">
              <legend className="text-xs text-white">Question Topic</legend>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="emotionalSafety"
                  name="questionTopic"
                  value="emotionalSafety"
                  checked={newQuestion.topic?.includes("emotionalSafety")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "emotionalSafety"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter(
                          (day) => day !== "emotionalSafety",
                        ),
                      }));
                    }
                  }}
                />
                <label htmlFor="emotionalSafety">
                  Emotional Safety and Depth
                </label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="support"
                  name="questionTopic"
                  value="support"
                  checked={newQuestion.topic?.includes("support")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "support"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter((day) => day !== "support"),
                      }));
                    }
                  }}
                />
                <label htmlFor="support">Support and Loyalty</label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="authenticity"
                  name="questionTopic"
                  value="authenticity"
                  checked={newQuestion.topic?.includes("authenticity")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "authenticity"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter(
                          (day) => day !== "authenticity",
                        ),
                      }));
                    }
                  }}
                />
                <label htmlFor="authenticity">Authenticity</label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="effort"
                  name="questionTopic"
                  value="effort"
                  checked={newQuestion.topic?.includes("effort")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "effort"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter((day) => day !== "effort"),
                      }));
                    }
                  }}
                />
                <label htmlFor="effort">Effort and Communication</label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="personality"
                  name="questionTopic"
                  value="personality"
                  checked={newQuestion.topic?.includes("personality")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "personality"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter(
                          (day) => day !== "personality",
                        ),
                      }));
                    }
                  }}
                />
                <label htmlFor="personality">Personality and Enjoyment</label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="growth"
                  name="questionTopic"
                  value="growth"
                  checked={newQuestion.topic?.includes("growth")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "growth"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter((day) => day !== "growth"),
                      }));
                    }
                  }}
                />
                <label htmlFor="growth">Growth and Inspiration</label>
              </div>
              <div className="flex gap-1 px-2 items-center">
                <input
                  type="checkbox"
                  id="boundaries"
                  name="questionTopic"
                  value="boundaries"
                  checked={newQuestion.topic?.includes("boundaries")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: [...prev.topic, "boundaries"],
                      }));
                    } else {
                      setNewQuestion((prev) => ({
                        ...prev,
                        topic: prev.topic.filter((day) => day !== "boundaries"),
                      }));
                    }
                  }}
                />
                <label htmlFor="boundaries">Boundaries</label>
              </div>
            </fieldset>
          )}
          {newQuestion.questionType && isTrueSlider == "false" && (
            <div className="flex flex-col">
              <p className="text-base text-white">Answer Options</p>
              <ul>{answerOptions}</ul>

              <button
                type="button"
                className="text-sm hover:text-white cursor-pointer mb-6"
                onClick={addOption}
              >
                Add Option +
              </button>
            </div>
          )}
          {isTrueSlider == "true" && (
            <div className="flex flex-col">
              <p className="text-base text-white">Slider Config</p>
              <label htmlFor="sliderMin" className="text-xs text-white">
                Slider Min
              </label>
              <input
                type="text"
                name="sliderMin"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={newQuestion.sliderConfig.min}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    sliderConfig: { ...prev.sliderConfig, min: e.target.value },
                  }))
                }
              />
              <label htmlFor="sliderMax" className="text-xs text-white">
                Slider Max
              </label>
              <input
                type="text"
                name="sliderMax"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={newQuestion.sliderConfig.max}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    sliderConfig: { ...prev.sliderConfig, max: e.target.value },
                  }))
                }
              />
              <label htmlFor="sliderStep" className="text-xs text-white">
                Slider Step Increment
              </label>
              <input
                type="text"
                name="sliderStep"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={newQuestion.sliderConfig.step}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    sliderConfig: {
                      ...prev.sliderConfig,
                      step: e.target.value,
                    },
                  }))
                }
              />
              <label htmlFor="minLabel" className="text-xs text-white">
                Label for Min
              </label>
              <input
                type="text"
                name="minLabel"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={newQuestion.sliderConfig.minLabel}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    sliderConfig: {
                      ...prev.sliderConfig,
                      minLabel: e.target.value,
                    },
                  }))
                }
              />
              <label htmlFor="maxLabel" className="text-xs text-white">
                Label for Max
              </label>
              <input
                type="text"
                name="maxLabel"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={newQuestion.sliderConfig.maxLabel}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    sliderConfig: {
                      ...prev.sliderConfig,
                      maxLabel: e.target.value,
                    },
                  }))
                }
              />
              <label htmlFor="baseScoreMin" className="text-xs text-white">
                Base Score Min
              </label>
              <input
                type="text"
                name="baseScoreMin"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={sliderBaseScore.min}
                onChange={(e) =>
                  setSliderBaseScore((prev) => ({
                    ...prev,
                    min: e.target.value,
                  }))
                }
              />
              <label htmlFor="baseScoreMax" className="text-xs text-white">
                Base Score Max
              </label>
              <input
                type="text"
                name="baseScoreMax"
                className="border border-purple-300 rounded-md px-3 py-2 mb-6"
                value={sliderBaseScore.max}
                onChange={(e) =>
                  setSliderBaseScore((prev) => ({
                    ...prev,
                    max: e.target.value,
                  }))
                }
              />
            </div>
          )}
          {newQuestion.question !== "" &&
            newQuestion.questionType &&
            newQuestion.displayType &&
            (newQuestion.options.length > 0 || newQuestion.sliderConfig) && (
              <PrimaryButton
                innerText="Save Question"
                onClick={submitQuestion}
              />
            )}
        </div>
      )}
    </div>
  );
}
