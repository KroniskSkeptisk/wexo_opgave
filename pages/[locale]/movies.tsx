import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchMovies } from 'lib/service';
import { Movie } from 'interfaces/index';
import { Loader } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import fs from 'fs';
import path from 'path';
import NavBar from '../../components/Navbar';
import { useWishlist } from 'lib/wishlist';

const genres = [
    "action",
    "comedy",
    "thriller",
    "war",
    "romance",
    "drama",
    "crime",
    "documentary",
    "horror"
]

export default function SeriesPage({ localeData, locale }: { localeData: any, locale: string }) {
    const router = useRouter(); //Brug next.js router
    const { genre } = router.query; //Få nuværende genre
    const [movies, setMovies] = useState<Movie[]>([]); //Sæt film til en tom array som fælger Movie interface
    const [loading, setLoading] = useState(true); //Sæt loading til at være true som standart
    const { wishlist } = useWishlist(); //Brug wishlist da vi bruger den i navbar

    useEffect(() => {
        if (!genre) {
            router.replace(`/${router.query.locale}/movies?genre=all`); // Sæt til "all" hvis der er ikke en genre sat.
            return;
        }

        if (!genres.includes(genre.toString()) && genre !== "all") { //Check if genren er all   
            router.replace(`/${router.query.locale}/series?genre=all`); // Sæt til "all" hvis der er en ugyldig genre sat
            return;
        }

        const loadMovies = async () => { //Load film
            try {
                setLoading(true);
                const fetchedMovies = await fetchMovies(genre !== 'all' ? `genre:${genre}` : undefined); // Fetch baseret alt efter hvad der er er valgt.

                if (fetchedMovies == null) { //Hvis fetched movies er null så sæt movies til en tom array (timeout)
                    setMovies([]);
                    return;
                };

                setMovies(fetchedMovies.entries || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, [genre]);

    const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => { //Skift genre og push nyt link
        const selectedGenre = event.target.value || 'all';
        router.push(`/${router.query.locale}/movies?genre=${selectedGenre}`);
    };

    const hrefId = (id: any) => {
        router.push(`/${router.query.locale}/movies/${id}`); //Sæt linket til filem med film id'et
    };

    const isAllCategory = genre === 'all';

    return (
        <>
            <NavBar locale={locale} localeData={localeData} wishlist={wishlist}/>
            <div className='w-full h-screen p-16 overflow-x-hidden'>
                <div className='w-full h-[6rem] flex justify-between items-start'>
                    <div className='flex flex-row gap-2'>
                        <a href={`/${router.query.locale}/`}>
                            <IconArrowLeft size="3.5rem" color="#fff" />
                        </a>
                        <span className='text-5xl text-white font-bold'>{localeData.movies} {!isAllCategory ? `(${genre})` : ""}</span>
                    </div>

                    <select onChange={handleGenreChange} value={genre} className='ml-auto p-4 border rounded-md'>
                        <option value='all'>{localeData.all}</option>
                        <option value='action'>{localeData.action}</option>
                        <option value='comedy'>{localeData.comedy}</option>
                        <option value='drama'>{localeData.drama}</option>
                        <option value='thriller'>{localeData.thriller}</option>
                        <option value='war'>{localeData.war}</option>
                        <option value='crime'>{localeData.crime}</option>
                        <option value='romance'>{localeData.romance}</option>
                        <option value='documentary'>{localeData.documentary}</option>
                        <option value='horror'>{localeData.horror}</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader color="gray" size="xl" />
                    </div>
                ) : (
                    <div className={`w-full ${isAllCategory && movies.length !== 0 ? 'grid grid-cols-8 gap-4' : movies.length === 0 ? '' : 'grid grid-cols-7 gap-4'} min-h-[23rem] bg-[#1C1C1C] rounded-md border-2 border-[#353535] p-4`}>
                        {movies.length == 0 ?
                            <>
                                <div className='w-full h-[21rem] flex justify-center items-center'>
                                    {localeData.loadingError}
                                </div>
                            </>
                            :
                            movies.map((movie) => {
                                const movieId = movie.id.split('/').pop(); //Få id'et fordi serie.id er et link.
                                
                                return (
                                    <div onClick={() => {hrefId(movieId)}} key={movie.id} className='w-full h-[21rem] border-2 border-[#353535] rounded-md flex justify-center items-center text-center hover:scale-[105%] duration-500 transition-all'>
                                        <div className="text-center text-base font-semibold">{movie.title}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )}
            </div>
        </>
  );
}


export async function getServerSideProps({ params, query }: any) {
    let locale = query.locale || 'da';  // Sæt default til at være da hvis der ikke er en locale sat.

    if (locale.toString() !== "en" && locale.toString() !== "da") {
        return {
            redirect: {
                destination: '/da/movies',
                permanent: false,
            },
        };
    }

    const filePath = path.join(process.cwd(), 'locals', `${locale}.json`); //Load locale data fra json filer
    const fileContent = fs.readFileSync(filePath, 'utf8'); //Læs filen
    const localeData: LocaleData = JSON.parse(fileContent); //Parse JSON data og send til client da dette er serverside

    return {
        props: {
            localeData,
            locale
        },
    };
}
