import { useState, useEffect } from 'react';
import supabase from '../supabase/supabase-client';

export default function Avatar({ url, size = 150, onUpload }) {
  // I tuoi stati originali
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Il tuo useEffect originale
  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url]);

  // La tua funzione downloadImage quasi identica
  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) throw error;

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.error('Error downloading image:', error.message);
    }
  };

  // La tua funzione uploadAvatar quasi identica
  const uploadAvatar = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{ width: size, height: size, borderRadius: '50%' }}
        />
      ) : (
        <div
          className="avatar-placeholder"
          style={{ width: size, height: size }}
        />
      )}
      <div style={{ width: size, marginTop: '10px' }}>
        <input
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
