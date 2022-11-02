export const slidesToEntries = (slides, filterSlides) => {
    let entries = [];
    Object.keys(slides).forEach(key => {
        entries.push({
            ...slides[key],
            id: key,
            updated: false
        })
    });
    return filterSlides ? filterSlidesOnStatus(entries) : entries;
}

export const filterSlidesOnStatus = (stack) => {
    return stack.filter(element => element.curated);
}

export const rowsToEntries = (rowData, curated) => {
    const uniqId = rowData.row?.uniqId || rowData.id;
    const talentName = rowData.row?.talentName || rowData.talentName;
    const formData = rowData.row || rowData.formData;
    //console.log(props.properties);
    const slideData = {};
    slideData[`${uniqId}`] = {
        talentName,
        formData, 
        curated
    };
    delete(slideData[`${uniqId}`].formData.id);
    delete(slideData[`${uniqId}`].formData.uniqId);
    delete(slideData[`${uniqId}`].formData.talentName);
    return slideData;
}
