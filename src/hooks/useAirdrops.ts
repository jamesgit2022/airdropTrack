import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Airdrop } from '../types/Airdrop';
import { useAuth } from '../contexts/AuthContext';

export const useAirdrops = () => {
  const { user } = useAuth();
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAirdrops();
    checkAdminStatus();
  }, [user]);

  const fetchAirdrops = async () => {
    try {
      const { data, error } = await supabase
        .from('airdrops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAirdrops(data || []);
    } catch (err: any) {
      console.error('Error fetching airdrops:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error('Error checking admin status:', error);
      }
      
      setIsAdmin(!!data);
    } catch (err) {
      console.error('Error checking admin status:', err);
      setIsAdmin(false);
    }
  };

  const addAirdrop = async (airdrop: Omit<Airdrop, 'id' | 'created_at'>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      const { data, error } = await supabase
        .from('airdrops')
        .insert([airdrop])
        .select()
        .single();

      if (error) throw error;
      setAirdrops([data, ...airdrops]);
      return data;
    } catch (err: any) {
      console.error('Error adding airdrop:', err);
      throw err;
    }
  };

  const updateAirdrop = async (id: string, updates: Partial<Airdrop>) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      const { data, error } = await supabase
        .from('airdrops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAirdrops(airdrops.map(a => a.id === id ? data : a));
      return data;
    } catch (err: any) {
      console.error('Error updating airdrop:', err);
      throw err;
    }
  };

  const deleteAirdrop = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');

    try {
      const { error } = await supabase
        .from('airdrops')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAirdrops(airdrops.filter(a => a.id !== id));
    } catch (err: any) {
      console.error('Error deleting airdrop:', err);
      throw err;
    }
  };

  return {
    airdrops,
    loading,
    error,
    isAdmin,
    addAirdrop,
    updateAirdrop,
    deleteAirdrop,
    refreshAirdrops: fetchAirdrops
  };
};
