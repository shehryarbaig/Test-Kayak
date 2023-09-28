export class KayakSearchPage{

    get departureDateTextElements() { return this.dateTextElements[0]}
    get destinationFieldTextElement() { return this.locationTextElements[3] }
    get dateTextElements() { return $$('.UgY6-date span.NITa-value')}
    get locationTextElements() { return $$('.UgY6-location div.vvTc-item-value') }
    get originFieldTextElement() { return this.locationTextElements[2] }
    get returnDateTextElements() { return this.dateTextElements[1]}
    get tripTypeTextElement() { return $$('.NITa-trip-type span.NITa-value')[1] }


    async getRatesForSortOption(sortOption: string) {

        const rateTextElement = await $(`.Hv20 > div[aria-label="${sortOption}"] div.Hv20-value span:first-child`);
        const rateText = await rateTextElement.getText();
        const rate = parseInt(rateText.replace('$', '').replace(',', '')); 
    
        return rate;
    }

    async getTimesForSortOption(sortOption: string) {

        const timeTextElement = await $(`.Hv20 > div[aria-label="${sortOption}"] div.Hv20-value span:last-child`);
    
        const timeText = await timeTextElement.getText();
        const [hoursStr, minutesStr] = timeText.split(' ');
    
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
    
        const currentTime = new Date();
        currentTime.setHours(hours);
        currentTime.setMinutes(minutes);
    
        return currentTime;
    }
}

export default new KayakSearchPage()
