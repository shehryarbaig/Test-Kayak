import { expect } from "chai";
import KayakHomePage from "../pageobjects/kayak.home.page";
import KayakSearchPage from "../pageobjects/kayak.search.page";

describe("Testing Kayak Home Page", () => {

    before("Open Kayak App", async () => {
        await KayakHomePage.open();
    })

    describe("Feature 1: Display Required Fields in Kayak Flights Navigation", () => {

        before("Navigate to Flights", async () => {
            await KayakHomePage.openFlightsNav();
        })

        it("Should display the origin field", async () => {

            expect(await KayakHomePage.originFieldsElement).to.have.lengthOf(1)

        })

        it("Should display the destination field", async () => {

            expect(await KayakHomePage.destinationFieldsElement).to.have.lengthOf(1)

        })

        it("Should display the departure date field", async () => {

            expect(await KayakHomePage.departureDateFieldsElement).to.have.lengthOf(1)

        })

        it("Should display the return date field", async () => {

            expect(await KayakHomePage.isFieldDisplayed(await KayakHomePage.returnDateFieldElement)).to.be.true;

        })

        it("Should display round trip in the trip type field", async () => {

            const tripTypeText = await KayakHomePage.tripTypeTextElement.getText()
            expect(tripTypeText).to.equal(KayakHomePage.ROUND_TRIP)

        })
    })

    describe("Feature 2: Display Required Fields when One-Way trip type is selected", () => {

        before("Select One-way trip type", async () => {

            await KayakHomePage.selectTripType(KayakHomePage.TRIP_TYPE_IDS[KayakHomePage.ONEWAY_TRIP])

        })

        it("Should display the origin field", async () => {

            expect(await KayakHomePage.originFieldsElement).to.have.lengthOf(1)

        })

        it("Should display the destination field", async () => {

            expect(await KayakHomePage.destinationFieldsElement).to.have.lengthOf(1)

        })

        it("Should display the departure date field", async () => {

            expect(await KayakHomePage.departureDateFieldsElement).to.have.lengthOf(1)

        })

        it("Should not display return date field", async () => {

            expect(await KayakHomePage.isFieldDisplayed(await KayakHomePage.returnDateFieldElement)).to.be.false;

        })

    })

    describe("Feature 3: Display Required Fields when Multi-city trip type is selected", () => {

        before("Select Multi-city trip type", async () => {
            await KayakHomePage.selectTripType(KayakHomePage.TRIP_TYPE_IDS[KayakHomePage.MULTICITY_TRIP])

        })

        it("Should display the origin fields", async () => {

            expect(await KayakHomePage.originFieldsElement).to.have.lengthOf(3)

        })

        it("Should display the destination fields", async () => {

            expect(await KayakHomePage.destinationFieldsElement).to.have.lengthOf(3)

        })
        it("Should display the departure date fields", async () => {

            expect(await KayakHomePage.departureDateFieldsElement).to.have.lengthOf(3)

        })

    })

    describe("Feature 4: Functionality related to Travel Fields", () => {

        before("", async () => {

            await KayakHomePage.travelersContainerElement.click();

        })

        it("Should display appropriate error message when adults count is increased to 10", async () => {

            await KayakHomePage.changeTravelerCount(10, KayakHomePage.ADULTS);
            expect(await KayakHomePage.adultsCountErrorElementElement.getText()).to.equals(KayakHomePage.ADULTS_COUNT_ERR_MSG);

        })

        it("Should display 4 travelers when adults count is increased to 4", async () => {

            await KayakHomePage.changeTravelerCount(4, KayakHomePage.ADULTS);
            expect(await KayakHomePage.travelersTextElement.getText()).to.equals("4 travelers");

        })

        it("Should display 6 travelers when adults count is increased to 4 and children is 2", async () => {

            await KayakHomePage.changeTravelerCount(4, KayakHomePage.ADULTS);
            await KayakHomePage.changeTravelerCount(2, KayakHomePage.CHILDREN);
            expect(await KayakHomePage.travelersTextElement.getText()).to.equals("6 travelers");

        })

    })

    describe("Feature 5: Functipnality related to input fields", () => {

        before("Select Round trip type", async () => {

            await KayakHomePage.selectTripType(KayakHomePage.TRIP_TYPE_IDS[KayakHomePage.ROUND_TRIP])

        })

        it("Should display 'Paris, France (PAR)' when PAR is entered and first suggestion is selected in origin field", async () => {

            await KayakHomePage.selectNewOrigin("PAR")
            expect(await KayakHomePage.originFieldItemsElement[0].getText()).to.equals("Paris, France (PAR)")

        })

        it("Should display 'New York, United States (NYC)' when NYC is entered and first suggestion is selected in destination field", async () => {

            await KayakHomePage.selectNewDestination("NYC")
            expect(await KayakHomePage.destinationFieldItemsElement[0].getText()).to.equals("New York, United States (NYC)")

        })

        it("Should display correct departure date when 'current date + 3' is selected", async () => {

            await KayakHomePage.selectDate(3, await KayakHomePage.departureDateFieldElement)
            KayakHomePage.flight.departureDateText = KayakHomePage.getCurrentFormattedDate(3)
            expect(await KayakHomePage.departureDateTextElement.getText()).to.equals(KayakHomePage.flight.departureDateText)

        })

        it("Should display correct return date when 'current date + 6' is selected", async () => {

            await KayakHomePage.selectDate(6, await KayakHomePage.returnDateFieldElement)
            KayakHomePage.flight.returnDateText = KayakHomePage.getCurrentFormattedDate(6)
            expect(await KayakHomePage.returnDateTextElement.getText()).to.equals(KayakHomePage.flight.returnDateText)


        })

    })

    describe("Feature 6: Functionality related to Flight Search", ()=> {

        before("Cick on flight search button", async () => {

            KayakHomePage.deselectCompareOptions()
            await KayakHomePage.searchFlights();

        })

        it("Should open searches for flights", async () => {

            expect(await KayakHomePage.isFieldDisplayed(await KayakHomePage.flightRatesContainer)).to.be.true;

        })

        it("Should show cheapest rate in Cheapest sort option", async () => {

            const cheapestRates = await KayakSearchPage.getRatesForSortOption('Cheapest');
            const bestRates = await KayakSearchPage.getRatesForSortOption('Best');
            const quickestRates = await KayakSearchPage.getRatesForSortOption('Quickest');

            expect(cheapestRates).to.be.lessThanOrEqual(bestRates);
            expect(cheapestRates).to.be.lessThanOrEqual(quickestRates);

        })

        it("Should show lowest time in Quickest sort option", async () => {

            const cheapestTimes = await KayakSearchPage.getTimesForSortOption('Cheapest');
            const bestTimes = await KayakSearchPage.getTimesForSortOption('Best');
            const quickestTimes = await KayakSearchPage.getTimesForSortOption('Quickest');

            expect(quickestTimes).to.be.lessThanOrEqual(bestTimes);
            expect(quickestTimes).to.be.lessThanOrEqual(cheapestTimes);

        })

        it("Should show corrent filled-in search fields", async () => {

            expect(await KayakSearchPage.tripTypeTextElement.getText()).to.equals(KayakHomePage.ROUND_TRIP)
            expect(await KayakSearchPage.originFieldTextElement.getText()).to.equals("Paris")
            expect(await KayakSearchPage.destinationFieldTextElement.getText()).to.equals("New York")
            expect(await KayakSearchPage.departureDateTextElements.getText()).to.equals(KayakHomePage.flight.departureDateText)
            expect(await KayakSearchPage.returnDateTextElements.getText()).to.equals(KayakHomePage.flight.returnDateText)

        })

    })

})
