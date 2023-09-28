import { formatDate } from "../utils"

interface Flight {
    departureDateText: string
    returnDateText: string
}

class KayakHomePage {

    private _parentWindow!: Promise<string>
    readonly ADULTS: string
    readonly ADULTS_COUNT_ERR_MSG: string
    readonly CHILDREN: string
    readonly MULTICITY_TRIP: string
    readonly ONEWAY_TRIP: string
    readonly ROUND_TRIP: string
    readonly TRAVELERS: { [key: string]: { [key: string]: number } }
    readonly TRIP_TYPE_IDS: { [key: string]: string }
    flight: Flight

    get adultsCountErrorElementElement() { return $('.cAWq-message') }
    get compareCheckboxElement() { return $('.RtT0-items input[type="checkbox"]')}
    get departureDateFieldElement() { return $('span[aria-label ="Start date calendar input"]') }
    get departureDateFieldsElement() { return $$('span[aria-label ="Start date calendar input"]') }
    get departureDateTextElement() { return $('span[aria-label ="Start date calendar input"] > span:nth-of-type(2)') }
    private get destinationFirstSuggestionElement() { return $('#flight-destination-smarty-input-list > li:nth-child(1)') }
    private get destinationFieldItemsCloseElement() { return $$('div.zEiP-destination div.vvTc-item-button') }
    get destinationFieldItemsElement() { return $$('div.zEiP-destination div.vvTc-item-value') }
    get destinationFieldsElement() { return $$('input[aria-controls="flight-destination-smarty-input-list"]') }
    private get flightNavItemElement() { return $('a[aria-label = "Search for flights "]') }
    get flightRatesContainer() { return $('.Hv20') }
    private get originFieldItemsCloseElement() { return $$('div.zEiP-origin div.vvTc-item-button') }
    get originFieldItemsElement() { return $$('div.zEiP-origin div.vvTc-item-value') }
    get originFieldsElement() { return $$('input[aria-controls="flight-origin-smarty-input-list"]') }
    private get originFirstSuggestionElement() { return $('#flight-origin-smarty-input-list > li:nth-child(1)') }
    private get nextMonthSelectorElement() { return $('button[aria-label="Next Month"]') }
    get parentWindow() { return this._parentWindow }
    private get previousMonthSelectorElement() { return $('button[aria-label="Previous month"]') }
    get returnDateFieldElement() { return $('span[aria-label ="End date calendar input"]') }
    get returnDateTextElement() { return $('span[aria-label ="End date calendar input"] > span:nth-of-type(2)') }
    private get searchButtonElement() { return $('.zEiP-submit > button[aria-label="Search"]') }
    get travelersContainerElement() { return $$('.S9tW-pres-default')[0] }
    get travelersTextElement() { return $$('.S9tW-pres-default > span:nth-child(1)')[0] }
    private get tripTypeContainerElement() { return $('.Uqct-title').parentElement() }
    get tripTypeTextElement() { return $('.Uqct-title > span') }

    set parentWindow(window: Promise<string>) { this._parentWindow = window }

    constructor() {

        this.ADULTS = "Adults"
        this.ADULTS_COUNT_ERR_MSG = "Searches cannot have more than 9 adults"
        this.CHILDREN = "Children"
        this.MULTICITY_TRIP = "Multi-city"
        this.ONEWAY_TRIP = "One-way"
        this.ROUND_TRIP = "Round-trip"
        this.TRAVELERS = {
            [this.ADULTS]: { "id": 1, "maxAllowed": 9 },
            [this.CHILDREN]: { "id": 5, "maxAllowed": 7 },
        }
        this.TRIP_TYPE_IDS = {
            [this.ONEWAY_TRIP]: "oneway",
            [this.ROUND_TRIP]: "roundtrip",
            [this.MULTICITY_TRIP]: "multicity",
        }
        this.flight = {
            departureDateText: "",
            returnDateText: ""
        }
    }

    async openFlightsNav() {

        await this.flightNavItemElement.click();

    }

    async open() {

        await browser.url('https://www.kayak.com/');
        this.parentWindow = browser.getWindowHandle()
        await browser.maximizeWindow();

    }

    async selectTripType(id: string) {

        const tripItem = $(`#${id}`)
        await this.tripTypeContainerElement.click();
        await tripItem.waitForDisplayed({ timeout: 10000 });
        await tripItem.click();

    }

    async isFieldDisplayed(field: WebdriverIO.Element) {

        return await field.isDisplayed();

    }

    async changeTravelerCount(count: number, traveler: string) {

        const incrementCountButtonElement = await $(`div.u9Xa:nth-child(${this.TRAVELERS[traveler].id}) > label.u9Xa-label + div button[aria-label="Increment"]`)
        const countInputElement = await $(`div.u9Xa:nth-child(${this.TRAVELERS[traveler].id}) > label.u9Xa-label + div input[aria-label="${traveler}"]`)

        if (count > this.TRAVELERS[traveler].maxAllowed) {
            for (let i = 0; i < count; i++) {

                await incrementCountButtonElement.click();
            }
        }
        else {
            await countInputElement.setValue(count);
        }

    }

    async selectNewOrigin(originText: string) {

        while (await this.originFieldItemsCloseElement.length > 0) {
            await this.originFieldItemsCloseElement[0].click();
        }
        await this.originFieldsElement[0].clearValue();
        await this.originFieldsElement[0].setValue(originText);
        await this.originFirstSuggestionElement.click();

    }

    async selectNewDestination(destinationText: string) {

        while (await this.destinationFieldItemsCloseElement.length > 0) {
            await this.destinationFieldItemsCloseElement[0].click();
        }
        await this.destinationFieldsElement[0].clearValue();
        await this.destinationFieldsElement[0].setValue(destinationText);
        await this.destinationFirstSuggestionElement.click();

    }


    async selectDate(addDays: number, dateField: WebdriverIO.Element) {

        await dateField.click();
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + addDays)
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYearPlusMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
        const monthVisibleElement = $(`div[data-month="${currentYearPlusMonth}"]`);

        while (await monthVisibleElement.isExisting() == false) {
            const visibleMonth = +(await $(".ATGJ-monthWrapper > div").getAttribute("data-month")).split("-")[1]
            if (currentMonth < visibleMonth) {
                await this.previousMonthSelectorElement.click();
            }
            else {
                await this.nextMonthSelectorElement.click();
            }
        }
        const dateElement = await $(`div[aria-label="${formatDate(currentDate)}"]`)
        await dateElement.click()

    }

    async searchFlights() {

        await this.searchButtonElement.click();
        var windows = await browser.getWindowHandles()
        for (var i = 0; i < windows.length; i++) {
            if (windows[i] != await this.parentWindow) {
                browser.switchToWindow(windows[i])
                browser.maximizeWindow()
                break;
            }
        }
        await browser.pause(5000)

    }

    getCurrentFormattedDate(addDays: number): string {

        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + addDays)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = daysOfWeek[currentDate.getDay()];
        const month = (currentDate.getMonth() + 1).toString();
        const dayOfMonth = currentDate.getDate().toString();

        return `${dayOfWeek} ${month}/${dayOfMonth}`;

    }

    async deselectCompareOptions() {

        if(await this.compareCheckboxElement.getAttribute("value") == "true"){
            await this.compareCheckboxElement.click();
        }

    }

}

export default new KayakHomePage;
