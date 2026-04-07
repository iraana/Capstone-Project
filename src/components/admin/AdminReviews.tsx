import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../supabase-client';
import { Star, Filter, Download, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';


interface Dish {
  dish_id: number;
  name: string;
  price: number;
}
interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

type Review = {
  review_id: number;
  user_id: string;
  dish_id: number;
  rating: number;
  comment: string;
  timestamp: string;
  Dishes?: Dish | null; 
  profiles?: UserProfile | null; 
};

type FilterType = 'all' | '1' | '2' | '3' | '4' | '5';

export const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  
  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ['admin_reviews', startDate, endDate],
    queryFn: async () => {
      let query = supabase
        .from('Reviews') 
        .select(`
            review_id, user_id, dish_id, rating, comment, timestamp,
            Dishes(dish_id, name, price, dish_status),  
            profiles(id, first_name, last_name, email) 
        `)
        .eq('Dishes.dish_status', true)
        .order('timestamp', { ascending: false });

      
      if (startDate) {
        query = query.gte('timestamp', startDate);
      }
      if (endDate) {
        query = query.lte('timestamp', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as unknown as Review[] || []; 
    },
  });

   const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      const { error } = await supabase
        .from('Reviews')
        .delete()
        .eq('review_id', reviewId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews', startDate, endDate] });
    },
  });


  // --- Export to CSV 
  const exportToCSV = () => {
    if (reviews.length === 0) return;

    const csvContent = [
      "Review ID,Reviewer Name,Dish Name,Rating,Comment,Timestamp",
      ...reviews.map(review => [
        review.review_id,
        review.profiles 
            ? `${review.profiles.first_name} ${review.profiles.last_name}`.trim() || review.user_id.substring(0, 8)
            : review.user_id.substring(0, 8),// no name the 8 chars of id
        review.Dishes?.name || 'N/A',
        review.rating,
        `"${review.comment.replace(/"/g, '""')}"`,
        review.timestamp,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reviews_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Star ratings
  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </div>
  );
  
  
  const filteredReviews = reviews.filter((review) => {
    // Rating Filter
    if (filter !== 'all' && review.rating !== parseInt(filter)) return false;
    
    // Search Filter
    if (search) {
        const searchLower = search.toLowerCase();
        const commentMatch = review.comment.toLowerCase().includes(searchLower);
        const dishMatch = review.Dishes?.name?.toLowerCase().includes(searchLower);
        
        const reviewerName = `${review.profiles?.first_name || ''} ${review.profiles?.last_name || ''}`.toLowerCase();
        const reviewerMatch = reviewerName.includes(searchLower);
        
        if (!commentMatch && !dishMatch && !reviewerMatch) return false;
    }
    
    return true;
  });


  if (isLoading) {
    return <div className="p-12 text-center text-zinc-500">Loading Reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dish Reviews ({filteredReviews.length})
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
            {/* Export Button */}
            <button
                onClick={exportToCSV}
                disabled={filteredReviews.length === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-700 text-white hover:bg-green-800 rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-green-700/30"
            >
                <Download size={16} /> Export to CSV
            </button>

            {/* Rating Filters */}
            <div className='flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 rounded-xl p-1 bg-white dark:bg-zinc-800'>
                <Filter size={16} className="text-zinc-400 ml-1" />
                {(['all', '5', '4', '3', '2', '1'] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                            filter === f
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                        }`}
                    >
                        {f === 'all' ? 'All' : `${f} Star`}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Comment, Dish Name, or Reviewer Name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />

      {/* Date Range Filters */}
      <div className='flex flex-wrap items-center gap-4 p-3 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800'>
        <Calendar size={20} className="text-zinc-500 shrink-0" />
        
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
          Date Range:
        </span>
        
        {/* Start Date */}
        <label htmlFor="start-date" className="sr-only">
          Start date
        </label>
        
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
        />
        
        <span className="text-gray-900 dark:text-zinc-500">to</span>
        
        {/* End Date */}
        <label htmlFor="end-date" className="sr-only">
          End date
        </label>
        
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
        />
      </div>


      {/* Table Display */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center text-zinc-500 bg-white dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
            No reviews match your current filter/search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                <thead className="bg-zinc-50 dark:bg-zinc-800/80">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Dish Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Comment</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Reviewer</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Actions</th> 
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredReviews.map((review) => (
                        <tr key={review.review_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">{review.review_id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                                {review.Dishes?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-700 dark:text-zinc-300">
                                <StarRating rating={review.rating} />
                            </td>
                            <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 max-w-sm truncate">
                                {review.comment}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                {review.profiles 
                                    ? `${review.profiles.first_name} ${review.profiles.last_name}`.substring(0, 20)
                                    : review.user_id.substring(0, 8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-500 dark:text-zinc-400">
                                {new Date(review.timestamp).toLocaleDateString()}
                            </td>
                            {/* --- DELETE BUTTON --- */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Are you sure you want to delete review #${review.review_id}?`)) {
                                            deleteReviewMutation.mutate(review.review_id);
                                        }
                                    }}
                                    disabled={deleteReviewMutation.isPending}
                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition disabled:opacity-50"
                                    title="Delete Review"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};