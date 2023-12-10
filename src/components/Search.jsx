import React,{useState} from 'react'
import "../styles/Search.scss";
import md5 from 'md5';
import Characters from './Characters';
import Comics from './Comics';


export default function Search() {
  const[characterName,setCharacterName]=useState("");
  const[characterData,setCharacterData]=useState(null);
  const[comicData,setComicData]=useState(null);
  const publicKey=import.meta.env.VITE_PUBLIC_KEY;
  const privateKey=import.meta.env.VITE_PRIVATE_KEY

const handleSubmit=(event)=>{
event.preventDefault();
getCharacterData();

};

const getCharacterData=()=>{
  setCharacterData(null);
  setComicData(null);
  const timeStamp= new Date().getTime();
  const hash= generateHash(timeStamp);
const url=`https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`
fetch(url)
.then((response)=>response.json())
.then((result)=>
{
  setCharacterData(result.data);
  console.log(result);
}).catch((error)=>{console.log("There is an error : ",error)});

};

const getComicData=(characterId)=>{
window.scrollTo({top:0, left:0});
const timeStamp= new Date().getTime();
const hash= generateHash(timeStamp);
const url=`https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}`
fetch(url).then(response=>response.json()).then(results =>{
  setComicData(results.data);
  console.log(results);
})
.catch(error =>{
  console.log("Error while fetching comic data ", error);
})


};


const generateHash=(timeStamp)=>
{
  return md5(timeStamp + privateKey + publicKey )
}

const handleChange=(event)=>{
setCharacterName(event.target.value);

};

const handleReset=()=>{
  setCharacterData(null)
  setComicData(null)
  setCharacterName("")
};



  return (
  <>
    <form  className='search' onSubmit={handleSubmit}>
      <input id='tool' placeholder='ENTER CHARACTER NAME' onChange={handleChange} type="text" />
      <div className="buttons">
        <button type='submit'>Get character data</button>
        <button type='reset' className='reset' onClick={handleReset}>reset</button>
      </div>
    </form>
    {!comicData && characterData && characterData.results[0] &&
    (
      <Characters data={characterData.results} onClick={getComicData} />
    )}
   {comicData && comicData.results[0] && <Comics data={comicData.results} />}
  </>
  );
}
