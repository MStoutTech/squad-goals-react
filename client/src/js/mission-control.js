
//Mission Timer

document.addEventListener("DOMContentLoaded", () => {
    const missionForm = document.getElementById("mission-form");
    const timerSection = document.getElementById("mission-timer");
    const timerDisplay = document.getElementById("timer-display");
    const startMissionBtn = document.getElementById("start-mission");
    const startOverBtn = document.getElementById("start-over");
    const debriefBtn = document.getElementById("mission-debrief");

    let countdownInterval;

    function startTimer(minutes) {
        let timeRemaining = minutes * 60;

        //  SHOW STARTING TIME IMMEDIATELY
        const mins = Math.floor(timeRemaining / 60);
        const secs = timeRemaining % 60;
        timerDisplay.textContent = 
            `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        //  THEN start interval
        countdownInterval = setInterval(() => {
            timeRemaining--;

            const minsNow = Math.floor(timeRemaining / 60);
            const secsNow = timeRemaining % 60;

            timerDisplay.textContent =
                `${minsNow.toString().padStart(2, '0')}:${secsNow.toString().padStart(2, '0')}`;

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                timerDisplay.textContent = "00:00";
            }
        }, 1000);
    }

    startMissionBtn.addEventListener("click", () => {
        const timeSelect = document.getElementById("time-select");
        const minutes = parseInt(timeSelect.value);

        missionForm.classList.add("hidden");
        timerSection.classList.remove("hidden");

        startTimer(minutes);
    });

    startOverBtn.addEventListener("click", () => {
        clearInterval(countdownInterval);
        timerDisplay.textContent = "00:00";
        missionForm.reset();

        timerSection.classList.add("hidden");
        missionForm.classList.remove("hidden");
    });

});


//Search contacts for adding new mission

function formatName(contact) {
    if (contact.nickname) {
        return `${contact.firstName} "${contact.nickname}" ${contact.lastName}`;
    }
    return `${contact.firstName} ${contact.lastName}`;
}


const addMissionForm = document.getElementById("add-mission-form");
const cancelBtn = document.querySelector("[command='close'][commandfor='add-mission-modal']")
const searchInput = document.querySelector("#contact-search-input");
const resultsBox = document.querySelector("#contact-search-results");
const selectedBox = document.querySelector("#selected-contact");
const selectedImage = document.querySelector('#selected-contact-image');
const selectedName = document.querySelector("#selected-contact-name");
const clearBtn = document.querySelector("#clear-selected-contact");
const hiddenInput = document.querySelector("#mission-contact-id");

let searchTimeout = null;

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();

    if (!query) {
        resultsBox.innerHTML = "";
        resultsBox.classList.add("hidden");
        return;
    }

    searchTimeout = setTimeout(async () => {
        const res = await fetch(`/mission/searchContacts?query=${query}`);
        const contacts = await res.json();

        resultsBox.innerHTML = contacts
            .map(
                c => {
                    const formatted = formatName(c);
                    return `
                        <li class="p-2 hover:bg-purple-400 cursor-pointer"
                            data-contact='${JSON.stringify(c)}'>
                            ${formatted}
                        </li>`;
                
            })
            .join("");

        resultsBox.classList.remove("hidden");

        // Add click handler
        document.querySelectorAll("#contact-search-results li").forEach(item => {
            item.addEventListener("click", () => {
                const contact = JSON.parse(item.dataset.contact);

                const formatted = formatName(contact);

                hiddenInput.value = contact._id;

                selectedName.textContent = formatted;

                selectedImage.src = contact.image
                    ? contact.image
                    : "/imgs/icons/profile.png";

                searchInput.classList.add("hidden");
                resultsBox.classList.add("hidden");
                selectedBox.classList.remove("hidden");
            });
        });
    }, 200);
});

clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    hiddenInput.value = "";

    selectedBox.classList.add("hidden");
    searchInput.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
    addMissionForm.reset();
    searchInput.classList.remove("hidden");
    selectedBox.classList.add("hidden");
    resultsBox.innerHTML = "";
    resultsBox.classList.add("hidden");
});

//Mission list event listeners
const missionList = document.querySelectorAll(".mission-list-item")

missionList.forEach(item =>{
    item.addEventListener("click", async () => {
        //Clear active styling from all missions
        missionList.forEach(item =>{
            item.classList.remove("mission-list-active");
            item.style.removeProperty("--highlight-color")
            item.classList.add("border-purple-300", "hover:bg-(--c-violet-void-80)", "hover:text-white", "text-purple-300")
        })
        
        //Determine color based on friendList
        let themeColor = ""
        switch(item.dataset.friendlist){
            case "heartCore": themeColor= "--c-deep-cerise";
            break;
            case "rayLiables": themeColor= "--c-light-coral";
            break;
            case "buddies": themeColor= "--c-green-sheen";
            break;
        }
        console.log(themeColor)
        //Apply dynamic color and active styles
        item.classList.remove("border-purple-300", "hover:bg-(--c-violet-void-80)", "hover:text-white","text-purple-300");
        item.style.setProperty("--highlight-color", `var(${themeColor})`);
        item.classList.add("mission-list-active");

        //Get data for the featured mission
        const id = item.dataset.id;
        const res = await fetch(`/mission/${id}/details`);
        const data = await res.json();
        showFeaturedMission(data, themeColor);

    });
})
function showFeaturedMission(data, themeColor) {
    const featuredDiv = document.getElementById("featured-div");
    const featuredSection = document.getElementById("featured-section")
    //Remove previous styles
        featuredDiv.classList.remove("border-(--c-light-coral)", "text-(--c-light-coral)");
        featuredSection.classList.remove("border-(--c-light-coral)", "bg-(--c-light-coral-80)/25");
    //Add new theme styles
        featuredDiv.style.setProperty("--highlight-color", `var(${themeColor})`);
        featuredSection.style.setProperty("--highlight-color", `var(${themeColor})`);

    let missionType = ""

    switch(data.mission.missionType){
        case "field": missionType ="Field Mission";
            break;
        case "contact": missionType = "Contact Mission";
            break;
    }
    
    //Mission details
    document.getElementById("featured-image").src = data.mission.contact.image || "/imgs/icons/profile.png"
    document.getElementById("featured-nickname").innerText = data.mission.contact.nickname || data.mission.contact.firstName;
    document.getElementById("featured-full-name").innerText = `${data.mission.contact.firstName} ${data.mission.contact.lastName}`;
    document.getElementById("featured-last-contact").innerText = data.mission.contact.LastContact ? `Last Contact: ${data.mission.contact.LastContact}` : "";
    document.getElementById("featured-mission-type").innerText = missionType;

    //Mission type flow
    const missionForm = document.getElementById("mission-form");
    const timerSection = document.getElementById("mission-timer");
    const timerHeader = document.getElementById("timer-header");
    const timerDisplay = document.getElementById("timer-display");
    const startOverBtn = document.getElementById("start-over");

    //Reset visibility
    missionForm.classList.add("hidden");
    timerSection.classList.add("hidden");
    timerHeader.classList.add("hidden");
    timerDisplay.classList.add("hidden");
    startOverBtn.classList.add("hidden");

    if (missionType === "Field Mission"){
        timerSection.classList.remove("hidden");
    }

    if (missionType === "Contact Mission"){
        missionForm.classList.remove("hidden");
        timerHeader.classList.remove("hidden");
        timerDisplay.classList.remove("hidden");
        startOverBtn.classList.remove("hidden");
    }

    //Debrief Modal info

    const debriefContactId = document.querySelector("#debrief-contact-id");

    document.getElementById("complete-mission-form").action = `/mission/${data.mission._id}/complete?_method=PUT`;
    document.getElementById("debrief-contact-name").innerText = `${data.mission.contact.firstName} ${data.mission.contact.lastName}`;
    debriefContactId.value = data.mission.contact._id;
    document.getElementById("debrief-mission-type").innerText = missionType;
    document.getElementById("debrief-mission-type-input").value = data.mission.missionType;

};