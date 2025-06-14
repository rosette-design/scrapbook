import { supabase, Collection, Moment, User } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ScrapbookMoment from "@/components/ScrapbookMoment";
import BackToTopButton from "@/components/BackToTopButton";

interface PageProps {
  params: Promise<{
    collection_id: string;
  }>;
}

export async function generateStaticParams() {
  const { data: collections, error } = await supabase
    .from("collections")
    .select("id");

  if (error) {
    console.error("Error fetching collections for static generation:", error);
    return [];
  }

  return (
    collections?.map((collection) => ({
      collection_id: collection.id,
    })) || []
  );
}

async function getCollection(id: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching collection:", error);
    return null;
  }

  return data;
}

async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

async function getMoments(collectionId: string): Promise<Moment[]> {
  const { data, error } = await supabase
    .from("moments")
    .select("*")
    .eq("collection_id", collectionId)
    .order("started_at", { ascending: true });

  if (error) {
    console.error("Error fetching moments:", error);
    return [];
  }

  return data || [];
}

export default async function CollectionPage({ params }: PageProps) {
  const { collection_id } = await params;
  const collection = await getCollection(collection_id);

  if (!collection) {
    notFound();
  }

  const [user, moments] = await Promise.all([
    getUser(collection.user_id),
    getMoments(collection_id),
  ]);

  return (
    <div className="min-h-screen scrapbook-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Scrapbook Cover/Header */}
        <div className="text-center mb-12">
          <div className="paper-texture bg-amber-50 rounded-lg p-8 shadow-lg transform -rotate-1 mx-auto max-w-2xl border-4 border-amber-200">
            <h1 className="text-5xl font-bold mb-4 handwriting-marker text-amber-800">
              {collection.name}
            </h1>

            {user && (
              <div className="handwriting-print text-xl text-amber-700 mb-4">
                <p className="mb-2">
                  A collection by{" "}
                  <span className="font-semibold">{user.name}</span>
                </p>
                <p className="text-base mt-2">
                  Started:{" "}
                  {new Date(collection.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="bg-yellow-200 px-4 py-2 rounded-full handwriting-print text-xl text-amber-800 transform rotate-2 shadow-md">
                {moments.length} {moments.length === 1 ? "Memory" : "Memories"}
              </div>
            </div>
          </div>
        </div>

        {/* Scrapbook Pages */}
        <div className="space-y-8">
          {moments.length === 0 ? (
            <div className="text-center py-16">
              <div className="paper-texture bg-white rounded-lg p-12 shadow-lg max-w-md mx-auto transform rotate-1">
                <p className="handwriting-marker text-2xl text-gray-600 mb-4">
                  No memories yet...
                </p>
                <p className="handwriting-print text-xl text-gray-500">
                  This scrapbook is waiting for its first beautiful moment!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 justify-items-center">
              {moments.map((moment) => (
                <ScrapbookMoment key={moment.id} moment={moment} />
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-center mt-16 mb-8">
          <BackToTopButton />
        </div>
      </div>
    </div>
  );
}
