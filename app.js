const express =require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const Destination=require('./models/destination');
const {DestinationSchema,reviewSchema}=require('./schemas.js');
const methodOverride = require('method-override');
const catchAsync=require('./utils/catchAsync');
const expressError=require('./utils/expressError');
const Joi = require('joi');
const Review = require('./models/review');



mongoose.connect('mongodb://localhost:27017/tour', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO DATABASE CONNECTED!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateDestination=(req,res,next)=>{
 const {error}=DestinationSchema.validate(req.body);
 if(error)
 {  const msg=error.details.map(el=>el.message).join(',');
   
     throw new expressError(msg,400);
 }else
 next();
}
const validateReview=(req,res,next)=>{
 
 const {error}=reviewSchema.validate(req.body);
 if(error)
 {  const msg=error.details.map(el=>el.message).join(',');
     throw new expressError(msg,400);
 }else
 next();
}



// app.get('/',(req,res)=>{
//     res.render("home");
// })

app.get('/',(req,res)=>{
    res.render("home");
})
app.get('/destination',catchAsync(async(req,res)=>{
    const place=await Destination.find({});
    res.render('destinations/index',{place});
}))
app.get('/destination/new',catchAsync(async(req,res)=>{
    // const place=await Destination.findById(req.params.id);
    res.render('destinations/new');
    
}))
app.post('/destination',validateDestination,  catchAsync(async(req,res)=>{
 
    const place=new Destination(req.body.destination);
    await place.save();
    res.redirect(`/destination/${place._id}`)
}))
app.get('/destination/:id',catchAsync(async(req,res)=>{
    const place=await Destination.findById(req.params.id).populate('reviews');
    // console.log(place);
    res.render('destinations/show',{place});
}))
app.get('/destination/:id/edit',catchAsync(async(req,res)=>{
    const place=await Destination.findById(req.params.id);
    res.render('destinations/edit',{place});
}))



app.put('/destination/:id',validateDestination, catchAsync(async(req,res)=>{
  const {id}=req.params;
  const place=await Destination.findByIdAndUpdate(id,{ ...req.body.destination});
 res.redirect(`/destination/${place._id}`);
}))

app.delete('/destination/:id',catchAsync(async(req,res)=>{
    const {id}=req.params;
    await Destination.findByIdAndDelete(id);
  
   res.redirect("/destination");
  }))

  app.post('/destination/:id/reviews',validateReview, catchAsync(async(req,res)=>{
    const place=await Destination.findById(req.params.id);
       const review=new Review(req.body.review);
   place.reviews.push(review);;
   await review.save();
   await place.save();
   res.redirect(`/destination/${place._id}`);

}))

app.delete('/destination/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Destination.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/destination/${id}`);
}))


  app.all('*',(req,res,next)=>{
      next(new expressError('page not found',404))
  })

  app.use((err,req,res,next)=>{
      const {statusCode=500}=err;
   if(!err.message)err.message='Something went Wrong';
    res.status(statusCode).render('error.ejs',{err});
  })
app.listen(3000,()=>{
    console.log('Listening on port 3000')
})