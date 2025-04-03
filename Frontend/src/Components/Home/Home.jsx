import React from 'react';
import QuizCard from '../Card';

function Home() {
    return (
        <div className="max-h-screen w-full  overflow-auto  flex flex-col items-center">
            <div className=" text-2xl font-semibold pt-3">Find your Quiz </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">

                {[...Array(10)].map((_, index) => (
                    <QuizCard key={index} hading={`Quiz ${index + 1}`} Field="Mathematics" Questions="10" Time="30" link={`quiz/:id${index + 1}`} />
                ))}
            </div>
        </div>
    );
}

export default Home;
