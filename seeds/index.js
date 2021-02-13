const mongoose=require('mongoose');
const destination=require('../models/destination');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelpers');


mongoose.connect('mongodb://localhost:27017/tour', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

    const sample = array => array[Math.floor(Math.random() * array.length)];
    const travelcost=Math.floor(Math.random() * 50000)+100;
    const seedb=async()=>{
        await destination.deleteMany({});
         for(let i=0;i<50;i++)
         {
        const randomnum=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random() * 50000)+100;

            const place= new destination({
                 location:`${cities[randomnum].city},${cities[randomnum].state}`,
                 title: `${sample(descriptors)} ${sample(places)}`,
                 image:'https://source.unsplash.com/collection/483251',
                 description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
                 travelcost:price

             })
             await place.save(); 
            }
    }

    seedb().then(()=>{
        mongoose.connection.close();
    });