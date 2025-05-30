import CarCard from "@/components/car-card";
import HomeSearch from "@/components/home-search";
import { Button } from "@/components/ui/button";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";
import { SignedOut } from "@clerk/nextjs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getFeatureCars } from "@/actions/home";
const Page = async () => {
  const featuredCars = await getFeatureCars();
  return (
    <div className="flex flex-col pt-16">
      {/* Hero Section with Gradient Title */}
      <section className="relative py-16 md:py-20 cool-background">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-8xl mb-5 gradient-title animate-pulse duration-5500 ease-in-out delay-200 pb-2">
              Discover Your Perfect Ride with Angelomotive
            </h1>
            <p className="mb-8 max-w-2xl mx-auto text-white font-semibold text-md">
              Smart AI-powered search and seamless test drive booking <br />
              across thousands of vehicles
            </p>
          </div>

          {/* Search Component (Client) */}
          <HomeSearch />
        </div>
      </section>

      <section className="py-12 mb-10">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold pl-1 gradient-title">
              Featured Cars
            </h2>
            <Button variant={"ghost"} className="flex items-center" asChild>
              <Link href={"/cars"}>
                View All
                <ChevronRight size={16} className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-2 mb-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold pl-1 gradient-title">
              Browse by Brand
            </h2>
            <Button variant={"ghost"} className="flex items-center" asChild>
              <Link href={"/cars"}>
                View All
                <ChevronRight size={16} className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
              >
                <div className="h-16 w-auto mx-auto mb-2 relative">
                  <Image
                    src={make.image}
                    alt={make.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h3 className="font-medium">{make.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 mb-5 mx-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-13">
            {/* Video */}
            <div className="relative w-full md:w-[100%] aspect-video">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-fill rounded-lg"
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Text */}
            <div className="w-full md:w-1/2 flex flex-col justify-center mt-6 px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 gradient-title md:mt-20">
                Why Choose Our Platform
              </h2>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-light">
                Angelomotive makes car buying simple, safe, and tailored to your
                lifestyle —<br className="hidden sm:block" />
                with a massive inventory, verified sellers,{" "}
                <br className="hidden sm:block" />
                and hassle-free test drive bookings,
                <br className="hidden sm:block" />
                all from the comfort of your screen.
              </p>
              <div>
                <Button variant={"outline"} className="mt-6 w-full sm:w-auto">
                  Click Here
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 ">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold gradient-title">
              Browse by Body Type
            </h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="relative group cursor-pointer"
              >
                <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                  <Image
                    src={type.image || `/body/${type.name.toLowerCase()}.webp`}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                  <h3 className="text-white text-xl font-bold pl-4 pb-2 ">
                    {type.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 mb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-5 gradient-title">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 cool-background text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4 gradient-title ">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-md text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              className="animate-bounce"
              asChild
            >
              <Link href="/cars">View All Cars</Link>
            </Button>
            <SignedOut>
              <Button size="lg" asChild>
                <Link href="/sign-up">Sign Up Now</Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
