import { useState } from "react";
import CharacterForm from "./CharacterForm";
import CharacterPreview from "./CharacterPreview";
import SavePanel from "./SavePanel";

const initialForm = {
    name: "",
    race: "",
    classType: "",
    level: 1,
    weapon: "",
    description: "",
    isPremium: false,
    stats: {
        strength: 0,
        agility: 0,
        intelligence: 0,
    },
};

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

function CharacterCreator() {
    const [formData, setFormData] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [savedCharacter, setSavedCharacter] = useState(null);

    const handleChange = (e) => {
     const {name , value , type , checked}=e.target;
     const newValue = type === 'checkbox'? checked:value;
     setFormData ((prev)=>
        {const newdata = cloneData(prev);
            if(name.startsWith('stats.')){
                const statname = name.split('.')[1];
                newdata.stats[statname]=parseInt(newValue)||0;
            }
            else{
                newdata[name]=type==='number'?
                parseInt(newValue):newValue;
            }
            return newdata;
        })
    };

    const validate = () => {
        const newErrors = {};
        const {name,race,classType,level,weapon,description,stats}=formData;
        if(name.length<3)newErrors.name = "Nick musi miec minimum 3 znaki";
        if(!race)newErrors.race='wybierz rase';
        if(!classType)newErrors.classType="wybierz clase";
        if(level<1 || level>60)newErrors.level="poziom musi byc w zakresie 1-60";
        if(!weapon)newErrors.weapon="wybierz bron";
        if(description.lenght<10)newErrors.description="opis musi miec minimum 10 znakow";
        const totalStat = stats.strength+stats.agility+stats.intelligence;
        if(totalStat>15)newErrors.stats=`suma statystyk(aktualnie:${totalStat})nie moze przekraczac 15`;


        return newErrors;
    };

    const handleSave = (e) => {
        e.preventDefault();

        const validateErrors = validate();
        setErrors (validateErrors);
        if(Object.keys(validateErrors).length===0){
            setSavedCharacter(cloneData(formData));
            alert("postac zostala zapisana");
        }
    };

    const handleLoadSaved = () => {
      if(savedCharacter){
        setFormData(cloneData(savedCharacter));
        setErrors({});
      }
    };

    const handleDeleteSaved = () => {
       setSavedCharacter(null);
    };

    const handleResetForm = () => {
       setFormData(initialForm);
       setErrors({});
    };

    return (
        <div className="creator-layout">
            <div className="panel">
                <h1>Kreator postaci RPG</h1>

                <CharacterForm
                    formData={formData}
                    errors={errors}
                    onChange={handleChange}
                    onSubmit={handleSave}
                />

                <SavePanel
                    hasSavedCharacter={!!savedCharacter}
                    onLoadSaved={handleLoadSaved}
                    onDeleteSaved={handleDeleteSaved}
                    onResetForm={handleResetForm}
                />
            </div>

            <div className="panel">
                <CharacterPreview
                    title="Podgląd aktualnego formularza"
                    character={formData}
                />

                <CharacterPreview
                    title="Zapisana postać"
                    character={savedCharacter}
                    emptyMessage="Brak zapisanej postaci."
                />
            </div>
        </div>
    );
}

export default CharacterCreator;