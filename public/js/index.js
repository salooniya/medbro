const $ = (selector) => document.querySelector(selector);

const loginSectionHandler = function (section) {
    const form = section.querySelector('form');
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();
            const email = section.querySelector('#email').value;
            const password = section.querySelector('#password').value;
            const res = await axios.post('/api/login', {
                email,
                password
            });
            console.log(res)
            setTimeout(() => {
                location.assign('/')
            }, 100);
        } catch (err) {
            console.log(err);
        }
    });
};

const loginSection = $('section.login');
if (loginSection) loginSectionHandler(loginSection);

const userSignupHandler = function (section) {
    const form = section.querySelector('form');
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();
            const firstName = section.querySelector('#first-name').value;
            const lastName = section.querySelector('#last-name').value;
            const email = section.querySelector('#email').value;
            const password = section.querySelector('#password').value;
            console.log(firstName, lastName, email, password);
            const res = await axios.post('/api/users/signup', {
                firstName,
                lastName,
                email,
                password
            });
            console.log(res)
            setTimeout(() => {
                location.assign('/')
            }, 100);
        } catch (err) {
            console.log(err);
        }
    });
};

const userSignupSection = $('section.user-signup');
if (userSignupSection) userSignupHandler(userSignupSection);

const doctorSignupHandler = function (section) {
    const form = section.querySelector('form');
    form.addEventListener('submit', async (e) => {
        try {
            e.preventDefault();
            const firstName = section.querySelector('#first-name').value;
            const lastName = section.querySelector('#last-name').value;
            const email = section.querySelector('#email').value;
            const password = section.querySelector('#password').value;
            console.log(firstName, lastName, email, password);
            const res = await axios.post('/api/doctors/signup', {
                firstName,
                lastName,
                email,
                password
            });
            console.log(res)
            setTimeout(() => {
                location.assign('/')
            }, 100);
        } catch (err) {
            console.log(err);
        }
    });
};

const doctorSignupSection = $('section.doctor-signup');
if (doctorSignupSection) doctorSignupHandler(doctorSignupSection);

const doctorProfileHandler = function (section) {
    const window = section.querySelector('box.window');
    const cover = window.querySelector('div.cover');
    const inputCover = window.querySelector('#profile-photo');
    const coverImage = window.querySelector('#show-cover');

    cover.addEventListener('click', (e) => {
        inputCover.click();
    });

    inputCover.addEventListener('change', (e) => {
        const file = e.target.files[0];
        coverImage.src = URL.createObjectURL(file);
    });

    const save = window.querySelector('button');
    save.addEventListener('click', async (e) => {

        const firstName = window.querySelector('#first-name').value || undefined;
        const lastName = window.querySelector('#last-name').value || undefined;
        const experience = window.querySelector('#experience').value || undefined;
        const qualifications = window.querySelector('#qualifications').value || undefined;
        const specializations = window.querySelector('#specializations').value || undefined;
        const description = window.querySelector('#description').value || undefined;
        const profilePhoto = window.querySelector('#profile-photo').files[0] || undefined;

        const form = new FormData();
        firstName && form.append('firstName', firstName);
        lastName && form.append('lastName', lastName);
        experience && form.append('experience', experience);
        qualifications && form.append('qualifications', qualifications);
        specializations && form.append('specializations', specializations);
        description && form.append('description', description);
        profilePhoto && form.append('profilePhoto', profilePhoto);

        const res = await axios.post('/doctors/updateMe', form);
        console.log(res)
    });
}

const doctorProfileSection = $('section.doctor-profile');
if (doctorProfileSection) doctorProfileHandler(doctorProfileSection);

const doctorClinicHandler = function (section) {
    const window = section.querySelector('box.window');

    const save = window.querySelector('button');
    save.addEventListener('click', async (e) => {

        const clinicName = window.querySelector('#clinic-name').value || undefined;
        const clinicLocation = window.querySelector('#clinic-location').value || undefined;
        const clinicFee = window.querySelector('#clinic-fee').value || undefined;

        const fromTimesEls = window.querySelectorAll('.clinic-time-From');
        const fromTimes = [...fromTimesEls].map(el => el.value);

        const toTimesEls = window.querySelectorAll('.clinic-time-To');
        const toTimes = [...toTimesEls].map(el => el.value);

        const clinicTimingsArr = [];
        fromTimes.forEach((x, i) => {
            clinicTimingsArr.push(`${fromTimes[i]}-${toTimes[i]}`);
        });

        const clinicTimings = clinicTimingsArr.join(';');
        console.log(clinicTimings);

        const form = new FormData();
        clinicName && form.append('clinicName', clinicName);
        clinicLocation && form.append('clinicLocation', clinicLocation);
        clinicFee && form.append('clinicFee', clinicFee);
        clinicTimings && form.append('clinicTimings', clinicTimings);

        const res = await axios.post('/doctors/updateMe', form);
        console.log(res)
    });
}

const doctorClinicSection = $('section.doctor-clinic');
if (doctorClinicSection) doctorClinicHandler(doctorClinicSection);

const dateToString = (date) => {
    const weekday = date.toLocaleDateString(undefined, {weekday: 'short'});
    const day = date.toLocaleString(undefined, {day: 'numeric'});
    const month = date.toLocaleString(undefined, {month: 'short'});
    return `${weekday}, ${day} ${month}`;
};

const getSlotsTiming = (currentTimings) => {
    let startTime = new Date('24 dec');
    startTime.setHours(currentTimings.from.split(':')[0]);
    startTime.setMinutes(currentTimings.from.split(':')[1]);

    let currTime = new Date('24 dec');
    currTime.setHours(currentTimings.from.split(':')[0]);

    while (currTime.getTime() < startTime.getTime()) {
        currTime = new Date(currTime.getTime() + 30 * 60 * 1000);
    }

    let endTime = new Date('24 dec');
    endTime.setHours(currentTimings.to.split(':')[0]);
    endTime.setMinutes(currentTimings.to.split(':')[1]);

    const slots = [];
    while (currTime.getTime() < endTime.getTime()) {
        slots.push(currTime);
        currTime = new Date(currTime.getTime() + 30 * 60 * 1000);
    }

    return slots;
};

const doctorHandler = function (section) {

    const slotsDiv = section.querySelector('div.slots');
    const clinicTimings = slotsDiv.getAttribute('data-timings');
    const timings = clinicTimings.split(';').map(t => {
        t = t.split('-');
        return {
            from: t[0],
            to: t[1]
        }
    });

    const slotH2 = section.querySelector('box.slot h2');
    const slotLeft = slotH2.querySelector('i.left');
    const slotRight = slotH2.querySelector('i.right');
    const slotSpans = slotH2.querySelectorAll('span');

    let prevDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let currentDate = new Date(Date.now());
    let nextDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    let currentTimings = timings[currentDate.getDay()];
    let prevTimings = timings[prevDate.getDay()];
    let nextTimings = timings[nextDate.getDay()];
    let currentSlotsTiming;
    let selectedTiming;
    let selectedDate;

    slotsDiv.addEventListener('click', (e) => {
        const el = e.target.closest('slot');
        if (!el) return;
        const slots = slotsDiv.querySelectorAll('slot');
        slots.forEach(slot => slot.classList.remove('selected'));
        const index = [...slots].indexOf(el);
        selectedTiming = currentSlotsTiming[index];
        el.classList.add('selected');

        const timeBookInfo = section.querySelector('.book-info .time');
        timeBookInfo.innerText = `${dateToString(selectedDate)} ( ${selectedTiming.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })} )`;
    });

    let i = 0;

    slotSpans[0].innerText = dateToString(prevDate);
    slotSpans[1].innerText = dateToString(currentDate);
    slotSpans[2].innerText = dateToString(nextDate);

    if (!prevTimings.from || !prevTimings.to) slotSpans[0].classList.add('empty');
    else slotSpans[0].classList.remove('empty');
    if (!currentTimings.from || !currentTimings.to) slotSpans[1].classList.add('empty');
    else slotSpans[1].classList.remove('empty');
    if (!nextTimings.from || !nextTimings.to) slotSpans[2].classList.add('empty');
    else slotSpans[2].classList.remove('empty');

    selectedDate = currentDate;

    const getSlotsHtml = () => {
        currentSlotsTiming = getSlotsTiming(currentTimings);
        const slotsHTML = currentSlotsTiming.map(slot => {
            return `<slot>${slot.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</slot>`
        }).join('');
        return slotsHTML;
    }

    (() => {
        const html = getSlotsHtml();
        if (!html) {
            slotsDiv.classList.add('no-slot');
            slotsDiv.innerHTML = '<p>No time slot available</p>'
        } else {
            slotsDiv.classList.remove('no-slot');
            slotsDiv.innerHTML = html;
        }
    })();

    const sloterRight = () => {
        console.log(i)
        if (i >= 13) return;
        i++;
        prevDate = currentDate;
        currentDate = nextDate;
        nextDate = new Date(nextDate.getTime() + 24 * 60 * 60 * 1000);

        slotSpans[0].innerText = dateToString(prevDate);
        slotSpans[1].innerText = dateToString(currentDate);
        slotSpans[2].innerText = dateToString(nextDate);

        currentTimings = timings[currentDate.getDay()];
        prevTimings = timings[prevDate.getDay()];
        nextTimings = timings[nextDate.getDay()];

        if (!prevTimings.from || !prevTimings.to) slotSpans[0].classList.add('empty');
        else slotSpans[0].classList.remove('empty');
        if (!currentTimings.from || !currentTimings.to) slotSpans[1].classList.add('empty');
        else slotSpans[1].classList.remove('empty');
        if (!nextTimings.from || !nextTimings.to) slotSpans[2].classList.add('empty');
        else slotSpans[2].classList.remove('empty');

        const html = getSlotsHtml();
        if (!html) {
            slotsDiv.classList.add('no-slot');
            slotsDiv.innerHTML = '<p>No time slot available</p>'
        } else {
            slotsDiv.classList.remove('no-slot');
            slotsDiv.innerHTML = html;
        }
        selectedDate = currentDate;
    };

    const sloterLeft = () => {
        if (i <= 0) return;
        i--;
        nextDate = currentDate;
        currentDate = prevDate;
        prevDate = new Date(prevDate.getTime() - 24 * 60 * 60 * 1000);

        slotSpans[0].innerText = dateToString(prevDate);
        slotSpans[1].innerText = dateToString(currentDate);
        slotSpans[2].innerText = dateToString(nextDate);

        currentTimings = timings[currentDate.getDay()];
        prevTimings = timings[prevDate.getDay()];
        nextTimings = timings[nextDate.getDay()];

        if (!prevTimings.from || !prevTimings.to) slotSpans[0].classList.add('empty');
        else slotSpans[0].classList.remove('empty');
        if (!currentTimings.from || !currentTimings.to) slotSpans[1].classList.add('empty');
        else slotSpans[1].classList.remove('empty');
        if (!nextTimings.from || !nextTimings.to) slotSpans[2].classList.add('empty');
        else slotSpans[2].classList.remove('empty');

        const html = getSlotsHtml();
        if (!html) {
            slotsDiv.classList.add('no-slot');
            slotsDiv.innerHTML = '<p>No time slot available</p>'
        } else {
            slotsDiv.classList.remove('no-slot');
            slotsDiv.innerHTML = html;
        }
        selectedDate = currentDate;
    };

    slotSpans[2].addEventListener('click', sloterRight);
    slotRight.addEventListener('click', sloterRight);

    slotLeft.addEventListener('click', sloterLeft);
    slotSpans[0].addEventListener('click', sloterLeft);

    let booked = false;
    const bookBtn = section.querySelector('box.booker button');
    bookBtn.addEventListener('click', async (e) => {
        console.log('Booking');
        if (booked) return;
        try {
            selectedTiming.setDate(selectedDate.getDate());
            selectedTiming.setFullYear(selectedDate.getFullYear());
            selectedTiming.setMonth(selectedDate.getMonth());
            const clinicTime = selectedTiming;
            const doctorID = location.pathname.split('/').pop();
            const res = await axios.post(`/doctors/${doctorID}/book-appointment`, {
                doctorID,
                clinicTime
            });
            console.log(res)
            booked = true;
            bookBtn.innerHTML = `<i>done</i><span>Booked</span>`;
            bookBtn.classList.add('booked');
        } catch (e) {
            console.log(e);
            booked = false;
        }
    });
}

const doctorSection = $('section.doctor');
if (doctorSection) doctorHandler(doctorSection);

const doctorAppointmentsHandler = (section) => {
    const window = section.querySelector('div.window-list');
    window.addEventListener('click', async (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.closest('button')?.classList.contains('accept')) {
            const appDiv = target.closest('div.app');
            const AppId = appDiv.getAttribute('data-id');
            try {
                const res = await axios.post(`/appointments/${AppId}/accepted`, {
                    accepted: true
                });
                console.log(res);
                location.assign(location.href);
            } catch (e) {
                console.log(e);
            }
        }
        if (target.closest('button')?.classList.contains('reject')) {
            const appDiv = target.closest('div.app');
            const AppId = appDiv.getAttribute('data-id');
            try {
                const res = await axios.post(`/appointments/${AppId}/accepted`, {
                    accepted: false
                });
                console.log(res);
                location.assign(location.href);
            } catch (e) {
                console.log(e);
            }
        }
    });
};

const doctorAppointmentsSection = $('section.doctor-appointments');
if (doctorAppointmentsSection) doctorAppointmentsHandler(doctorAppointmentsSection);

const userProfileHandler = function (section) {
    const window = section.querySelector('box.window');
    const cover = window.querySelector('div.cover');
    const inputCover = window.querySelector('#profile-photo');
    const coverImage = window.querySelector('#show-cover');

    cover.addEventListener('click', (e) => {
        inputCover.click();
    });

    inputCover.addEventListener('change', (e) => {
        const file = e.target.files[0];
        coverImage.src = URL.createObjectURL(file);
    });

    const save = window.querySelector('button');
    save.addEventListener('click', async (e) => {

        const firstName = window.querySelector('#first-name').value || undefined;
        const lastName = window.querySelector('#last-name').value || undefined;
        const age = window.querySelector('#age').value || undefined;
        const gender = window.querySelector('#gender').value || undefined;
        const profilePhoto = window.querySelector('#profile-photo').files[0] || undefined;

        const form = new FormData();
        firstName && form.append('firstName', firstName);
        lastName && form.append('lastName', lastName);
        age && form.append('age', age);
        gender && form.append('gender', gender);
        profilePhoto && form.append('profilePhoto', profilePhoto);

        const res = await axios.post('/users/updateMe', form);
        console.log(res)
    });
}

const userProfileSection = $('section.user-profile');
if (userProfileSection) userProfileHandler(userProfileSection);

const searchHandler = (section) => {
    const searchBtn = section.querySelector('.button');
    const refreshBtn = section.querySelector('.refresh');

    const u = new URL(location.href);

    refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        u.searchParams.delete('sort')
        u.searchParams.delete('location');
        const str = u.href;
        window.location.href = str;
    });

    section.querySelector('#location').value = u.searchParams.get('location');
    const sortV = u.searchParams.get('sort');

    if (sortV && sortV[0] === '-') {
        section.querySelector('#order').value = '-';
        section.querySelector('#sort').value = sortV.slice(1);
    } else {
        section.querySelector('#sort').value = sortV || '';
    }

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const sortBy = section.querySelector('#sort').value;
        const orderBy = section.querySelector('#order').value;
        const location = section.querySelector('#location').value;

        if (sortBy) {
            u.searchParams.set('sort', orderBy + sortBy)
        } else {
            u.searchParams.delete('sort')
        }

        if (location) {
            u.searchParams.set('location', location);
        } else {
            u.searchParams.delete('location')
        }

        const str = u.href;
        window.location.href = str;
    });
};

const searchSection = $('section.search');
if (searchSection) searchHandler(searchSection);

const spotlightHandler = (section) => {
    const form = section.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchValue = section.querySelector('#search').value;
        if (!searchValue) return;
        location.assign(`/search?speciality=${searchValue}`);
    });
};

const spotlightSection = $('section.spotlight');
if (spotlightSection) spotlightHandler(spotlightSection);
