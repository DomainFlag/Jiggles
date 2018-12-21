package com.example.cchiv.jiggles.player.tools;

import com.google.android.exoplayer2.upstream.DataSource;
import com.google.android.exoplayer2.upstream.TransferListener;

import java.io.PipedInputStream;

public class RemoteDataSourceFactory implements DataSource.Factory {

    private TransferListener<? super DataSource> mTransferListener;
    private PipedInputStream mInputStream;

    public RemoteDataSourceFactory(TransferListener<? super DataSource> listener, PipedInputStream inputStream) {
        mTransferListener = listener;
        mInputStream = inputStream;
    }

    @Override
    public RemoteDataSource createDataSource() {
        return new RemoteDataSource(mTransferListener, mInputStream);
    }
}
